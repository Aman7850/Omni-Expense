import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Button,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import {Card, Dialog, Divider, FAB, Portal, Appbar} from 'react-native-paper';
import {SearchBar} from 'react-native-elements';

import ImagePicker from 'react-native-image-crop-picker';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {db} from '../Database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WIDTH = Dimensions.get('window').width;
const wid = 0.45 * WIDTH;
const numColumns = 2;

const Draft = () => {
  const [Employee, setEmployee] = useState('');
  const [items, setItems] = useState([]);
  const [empty, setEmpty] = useState([]);
  const [uidAsync, setUidAsync] = useState('');
  const [MembershipID, setMembershipID] = useState('');
  const [Asyncurl, setAsyncurl] = useState('');
  const [spinLoader, setSpinLoader] = useState(false);
  
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    getData();
  }, [isFocused])

  const getData = async () => {
    try {
      const uid = await AsyncStorage.getItem('uID');
      const ur = await AsyncStorage.getItem('Url');
      const em = await AsyncStorage.getItem('email');
      const mem = await AsyncStorage.getItem('Membership');
      
      setUidAsync(uid);
      setMembershipID(mem);
      setEmployee(em);
      setAsyncurl(ur);
      db.transaction(tx => {
        return new Promise(resolve => {
          
          tx.executeSql(
            `SELECT oe.Customer_id,oe.Description,oe.Total,oe.Photo_id,oe.CreatedDate,oe.Products,oe.unitPrice,oe.Quantity,oe.PaidBy,oe.Status,oe.ExpenseId,oe.CurrencySymbol,oe.ExpenseReference,oe.submittedBy, oei.Expense_Images,oc.Currency FROM Omni_Expense oe, Omni_Expense_Image oei, Omni_Currency oc where oei.id=oe.Photo_id and oe.uId='${uid}' and oc.id=oe.CurrencySymbol and oe.Status='draft'`,
            [],
            (tx, results) => {
              resolve(results);
              var temp = [];
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
                
              }
              
              setItems(temp);

              if (results.rows.length >= 1) {
                setEmpty(false);
              } else {
                setEmpty(true);
              }
            },
          );
        });
      });
      
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    
    const handleStatus = async () => {
      for (var i = 0; i < items.length; i++) {
        
        if (items[i].ExpenseId !== null) {
          const response45 = await fetch(
            Asyncurl + '/o2b/omini/expense/status',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                jsonrpc: '2.0',
                params: {
                  membership_id: MembershipID,
                  expense_id: items[i].ExpenseId,
                },
              }),
            },
          );
          const json1256 = await response45.json();
          
          const todata = json1256.result;
          const obj = JSON.parse(todata, 'sattus update!');
         
          var obje = obj.status;
          if (obje == 'reported') {
            obje = 'submitted';
          }
          console.log(obje, 'chcking obje in handle status DRaft');
          

          const exid = items[i].ExpenseId;

          editStatus(obje, exid);
        }
      }
    };
    const intervalId = setInterval(() => {
      handleStatus();
    }, 1000 * 60 * 15); 
    return () => clearInterval(intervalId);
  }, [isFocused]);

  const listLoad = () => {
    console.log('h');
    db.transaction(tx => {
      return new Promise(resolve => {
        getData();
        tx.executeSql(
          `SELECT oe.Customer_id,oe.Description,oe.Total,oe.Photo_id,oe.CreatedDate,oe.Products,oe.unitPrice,oe.Quantity,oe.PaidBy,oe.Status,oe.ExpenseId,oe.CurrencySymbol,oe.ExpenseReference, oei.Expense_Images,oc.Currency FROM Omni_Expense oe, Omni_Expense_Image oei, Omni_Currency oc where oei.id=oe.Photo_id and oe.uId='${uid}' and oc.id=oe.CurrencySymbol and oe.Status='draft'`,
          [],
          (tx, results) => {
            resolve(results);
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
             
            }
            setItems(temp);
            if (results.rows.length >= 1) {
              setEmpty(false);
            } else {
              setEmpty(true);
            }
          },
        );
      });
    });
    handleStatustwo();
  };

  const editStatus = (obje, exid) => {
    
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE Omni_Expense SET Status='${obje}' where ExpenseId='${exid}'`,
        [],
        (tx, results) => {
          
          if (results.rowsAffected > 0) {
           
          }
        },
      );
    });
    
  };

  const takePhotoFromCamera = () => {
   
    ImagePicker.openCamera({
      includeBase64: true,
      includeExif: true,
      cropping: true,
      compressImageQuality: 0.6,
    }).then(image => {
      
      const showimage = image.path;
      setSpinLoader(true);
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO Omni_Expense_Image(Expense_Images) VALUES(?)',
          [image.data],
          (tx, results) => {
            console.log(
              'Results are saved on previos screen donot worry',
              results.rowsAffected,
            );
          },
        );
        tx.executeSql(
          'SELECT id FROM Omni_Expense_Image',
          [],
          (tx, results) => {
            var temp = [];
            j = 0;
            for (let i = 0; i < results.rows.length; ++i) {
              j = i;
              temp.push(results.rows.item(i));
            }
          
            const tempora = temp[j].id;
            setSpinLoader(false);
            navigation.navigate('FormScreen', {tempora, showimage});
          },
        );
      });
    });
  };

  const Statusformat = sta => {
    if (sta === 'draft') {
      return '#FB8C00';
    }
    if (sta === 'approved') {
      return 'blue';
    }
    if (sta === 'reported') {
      return 'purple';
    }
    if (sta === 'submitted') {
      return 'purple';
    }
    if (sta === 'done') {
      return 'green';
    }
    if (sta === 'refused') {
      return 'red';
    }
    return 'black';
  };

  const handleStatustwo = async () => {
    for (var i = 0; i < items.length; i++) {
     
      if (items[i].ExpenseId !== null) {
        const response45 = await fetch(Asyncurl + '/o2b/omini/expense/status', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            params: {
              membership_id: MembershipID,
              expense_id: items[i].ExpenseId,
            },
          }),
        });
        const json1256 = await response45.json();
        
        const todata = json1256.result;
        const obj = JSON.parse(todata, 'sattus update!');
        
        var obje = obj.status;
        if (obje == 'reported') {
          obje = 'submitted';
        }
        console.log(obje, 'chcking obje in handle status');
        

        const exid = items[i].ExpenseId;

        editStatus(obje, exid);
      }
    }
  };

  const emptyMSG = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          backgroundColor: '#E3F2FD',
        }}>
        <Text style={{fontSize: 25, textAlign: 'center'}}>
          {' '}
          No Records Yet! If Taking too much time hit refresh.
        </Text>
      </View>
    );
  };

  const navigateToEditScreen = (
    Customer_id,
    Description,
    Total,
    Photo_id,
    created_Date,
    Products,
    unitPrice,
    Quantity,
    PaidBy,
    Status,
    Expense_id,
    Expense_Images,
    CurrencySymbol,
    ExpenseReference,
    submittedBy,
  ) => {
    navigation.navigate('DetailScreen', {
      Customer_id: Customer_id,
      Description: Description,
      Total: Total,
      Photo_id: Photo_id,
      CreatedDate: created_Date,
      Products: Products,
      unitPrice: unitPrice,
      Quantity: Quantity,
      PaidBy: PaidBy,
      Status: Status,
      ExpenseId: Expense_id,
      Expense_Images: Expense_Images,
      CurrencySymbol: CurrencySymbol,
      ExpenseReference: ExpenseReference,
      submittedBy: submittedBy,
    });
  };

  return (
    <>
      <Appbar.Header
        style={{alignContent: 'center', backgroundColor: '#3D5AFE'}}>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Draft" titleStyle={{color: 'white'}} />
        <Appbar.Action icon="refresh" onPress={listLoad} />
      </Appbar.Header>
      {spinLoader ? (
        <View style={styles.containerLoader}>
          <ActivityIndicator
            color="#3D5AFE"
            size="large"
            animating={spinLoader}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={{flex: 1}}>
            {empty ? (
              emptyMSG(empty)
            ) : (
              <FlatList
                data={items}
                numColumns={2}
                keyExtractor={item => item.Customer_id}
                contentContainerStyle={{alignSelf: 'flex-start'}}
                renderItem={({item}) => (
                  <Card
                    style={{
                      marginHorizontal: 10,
                      margin: 10,
                      width: wid,
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        navigateToEditScreen(
                          item.Customer_id,
                          item.Description,
                          item.Total,
                          item.Photo_id,
                          item.CreatedDate,
                          item.Products,
                          item.unitPrice,
                          item.Quantity,
                          item.PaidBy,
                          item.Status,
                          item.ExpenseId,
                          item.Expense_Images,
                          item.CurrencySymbol,
                          item.ExpenseReference,
                          item.submittedBy,
                        )
                      }
                      style={{
                        justifyContent: 'flex-start',
                      }}>
                      <View>
                        <Image
                          style={{
                            width: '100%',
                            height: 120,
                          }}
                          source={{
                            uri: `data:image/png;base64,${item.Expense_Images}`,
                          }}
                        />
                      </View>
                      <View style={{alignItems: 'center'}}>
                        <Text style={styles.textsDescr}>
                          {item.Description}
                        </Text>
                        <Text style={styles.texts}>{item.CreatedDate}</Text>
                      </View>

                      <Divider
                        style={{borderColor: '#90CAF9', borderWidth: 0.5}}
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                        }}>
                        <View>
                          <Text style={styles.texts}>
                            {item.Currency} {item.Total}{' '}
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={{
                              margin: 3,
                              fontSize: 19,
                              fontWeight: 'bold',
                              fontFamily: 'Admin',
                              color: Statusformat(item.Status),
                              textTransform: 'capitalize',
                            }}>
                            {item.Status}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Card>
                )}
              />
            )}
          </View>
          <FAB icon="camera" style={styles.fab} onPress={takePhotoFromCamera}>
            ADD
          </FAB>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    top: '80%',
    
    backgroundColor: '#0288D1',
  },
  texts: {
    margin: 3,
    fontSize: 19,
    fontFamily: 'Admin',
  },
  textstatus: {
    margin: 3,
    fontSize: 19,
    fontWeight: 'bold',
    fontFamily: 'Admin',
  },
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  itemsList: {
    backgroundColor: '#B3E5FC',
    margin: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: WIDTH / numColumns,
    borderRadius: 15,
  },
  containerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textsDescr: {
    margin: 3,
    fontSize: 19,
    fontFamily: 'Admin',
    textAlign: 'center',
  },
});

export default Draft;
