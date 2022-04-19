import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Button, Card, Title, Appbar, FAB} from 'react-native-paper';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {db} from '../Database';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNModal from 'react-native-modal';

function Dashboard() {
  const [items, setItems] = useState([]);
  const [itemshown, setitemshown] = useState([]);
  const [empty, setEmpty] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [TotalAmount, setTotalAmout] = useState('');
  const [Loading, setLoading] = useState(false);
  const [uidAsync, setUidAsync] = useState('');
  const [itemData, setItemData] = useState(false);
  const [ExpenseRights, setExpenseRights] = useState('');
  const [spinLoader, setSpinLoader] = useState(false);
  const [modVisible, setModVisible] = useState(false);
  const arrayholder = [];
  const temp = [];

  useEffect(() => {
    getData();
  }, [isFocused, fullData]);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    
    db.transaction(tx => {
      tx.executeSql(
        `SELECT SUM(Total) FROM Omni_Expense where uId='${uidAsync}'`,
        [],
        (tx, results) => {
          var temp2 = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp2.push(results.rows.item(i));
            
          }
          
          setItems(temp2);
          
         
          const amountstring = JSON.stringify(items[0]);
          const amount_array = amountstring.slice(1, -1).split(':');
          
          checknotnull(amount_array[1]);
         
          if (results.rows.length >= 1) {
            setEmpty(false);
          } else {
            setEmpty(true);
          }
        },
      );
    });

  }, [isFocused, items]);

  const getData = async () => {
    try {
      const uid = await AsyncStorage.getItem('uID');
     
      const Exp_Rights = await AsyncStorage.getItem('ExpenseRights');
      setUidAsync(uid);
      setExpenseRights(Exp_Rights);
      db.transaction(tx => {
       
        tx.executeSql(
          
          `SELECT oe.Customer_id,oe.Description,oe.Total,oe.Photo_id,oe.CreatedDate,oe.Products,oe.unitPrice,oe.Quantity,oe.PaidBy,oe.Status,oe.ExpenseId,oe.CurrencySymbol,oe.ExpenseReference,oe.submittedBy, oei.Expense_Images,oc.Currency FROM Omni_Expense oe, Omni_Expense_Image oei, Omni_Currency oc where oei.id=oe.Photo_id and oe.uId='${uid}' and oc.id=oe.CurrencySymbol ORDER BY oe.Customer_id DESC`,
          
          [],
          (tx, results) => {
           
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
              
            }
            setFullData(temp);
            setLoading(true);
            
            if (results.rows.length >= 1) {
              setEmpty(false);
            } else {
              setEmpty(true);
            }
          },
        );
      });
     
    } catch (e) {
      
      console.log(e);
    }
  };

  const checknotnull = amount => {
    
    if (amount == 'null') {
      setTotalAmout('0');
    } else {
      setTotalAmout(amount);
    }
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

  
  const logout = async () => {
    try {
      AsyncStorage.clear().then(() => {
        setUidAsync('');
        navigation.navigate('login');
        
      });
      
    } catch (e) {
      console.log(e);
    }
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

  const emptyMSG = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <Text
          style={{fontSize: 25, textAlign: 'center', color: 'white'}}></Text>
      </View>
    );
  };

  const Approved = () => {
    
    setItemData(true);
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM Omni_Expense where Status='approved' and uId='${uidAsync}'`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
            
          }
         
          setitemshown(temp);
          
        },
      );
    });
  };

  const Paid = () => {
    setItemData(true);
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM Omni_Expense where Status='done' and uId='${uidAsync}'`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
            
          }
          
          setitemshown(temp);
          
        },
      );
    });
  };

  const Recent = async () => {
    
    setItemData(false);
    await db.transaction(tx => {
      return new Promise((resolve, reject) => {
        getData();
        tx.executeSql(
          `SELECT oe.Customer_id,oe.Description,oe.Total,oe.Photo_id,oe.CreatedDate,oe.Products,oe.unitPrice,oe.Quantity,oe.PaidBy,oe.Status,oe.ExpenseId,oe.CurrencySymbol,oe.ExpenseReference, oei.Expense_Images,oc.Currency FROM Omni_Expense oe, Omni_Expense_Image oei, Omni_Currency oc where oei.id=oe.Photo_id and oe.uId='${uidAsync}' and oc.id=oe.CurrencySymbol ORDER BY oe.Customer_id DESC`,
          [],
          (tx, results) => {
            resolve(results);
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
              arrayholder.push(results.rows.item(i));
            }
            
            setFullData(temp);
            setLoading(false);
            
          },
        );
      });
      
    });
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
        style={{alignContent: 'space-between', backgroundColor: '#3949AB'}}>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="   " titleStyle={{color: 'black'}} />
        <Appbar.Action icon="logout" onPress={() => setModVisible(true)} />
      </Appbar.Header>
      <View style={styles.container}>
        {spinLoader ? (
          <View style={styles.containerLoader}>
            <ActivityIndicator
              color="#ffffff"
              size="large"
              animating={spinLoader}
            />
          </View>
        ) : (
          <>
            <View style={styles.container}>
              <Card style={styles.cards} elevation={4}>
                <Card.Content
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginVertical: 45,
                  }}>
                  <Title style={{textAlign: 'center'}}>Total Expense</Title>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: 27,
                      fontWeight: 'bold',
                    }}>
                    {TotalAmount}
                  </Text>
                </Card.Content>
              </Card>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <Card style={styles.cardsButtons}>
                  <TouchableOpacity
                    onPress={Approved}
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Icon name="check-all" size={25} style={styles.Icons} />
                    <Title
                      style={{
                        alignItems: 'center',
                        marginHorizontal: 15,
                        marginVertical: 10,
                      }}>
                      Approved
                    </Title>
                  </TouchableOpacity>
                </Card>
                <Card style={styles.cardsButtons}>
                  <TouchableOpacity
                    onPress={Paid}
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Icon name="cash-plus" size={25} style={styles.Icons} />
                    <Title
                      style={{
                        alignItems: 'center',
                        marginHorizontal: 35,
                        marginVertical: 10,
                      }}>
                      Paid
                    </Title>
                  </TouchableOpacity>
                </Card>
              </View>
              <TouchableOpacity onPress={Recent} style={{alignItems: 'center'}}>
                <Title style={{color: '#FFFFFF'}}>Recent</Title>
              </TouchableOpacity>
              <Card style={{flex: 1, backgroundColor: '#3949AB'}}>
                {empty ? (
                  emptyMSG(empty)
                ) : (
                  <FlatList
                    data={itemData ? itemshown : fullData}
                    keyExtractor={item => item.Customer_id}
                    renderItem={({item}) => (
                      <View style={{padding: 10}}>
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
                            marginHorizontal: 10,
                            marginVertical: 5,
                            backgroundColor: '#ffffff',
                            borderRadius: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View>
                            <View>
                              <Text style={styles.texts}>
                                {item.Description}
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={[
                                  styles.texts,
                                  {
                                    color: Statusformat(item.Status),
                                    textTransform: 'capitalize',
                                  },
                                ]}>
                                {item.Status}
                              </Text>
                            </View>
                          </View>
                          <View>
                            <Text style={[styles.texts, {color: 'black'}]}>
                              {item.Currency} {item.Total}{' '}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                )}
              </Card>
              <FAB
                icon="camera"
                style={styles.fab}
                onPress={takePhotoFromCamera}>
                ADD
              </FAB>
              <RNModal
                isVisible={modVisible}
                onBackdropPress={() => setModVisible(false)}
                animationIn="zoomIn"
                animationOut="zoomOut">
                <View style={styles.rnmodalView}>
                  <Title style={{alignSelf: 'center', textAlign: 'center'}}>
                    Are you sure you want to Logout ?
                  </Title>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                    }}>
                    <Button mode="contained" onPress={logout}>
                      OK
                    </Button>
                    <Button
                      mode="contained"
                      onPress={() => setModVisible(false)}>
                      Cancel
                    </Button>
                  </View>
                </View>
              </RNModal>
            </View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3949AB',
  },
  containerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icons: {
    color: '#7E57C2',
  },
  baseText: {
    fontSize: 30,
    color: '#4DB6AC',
  },
  cards: {
    flex: 0,
    marginHorizontal: 10,
    marginVertical: 30,
    height: '30%',
  },
  cardsButtons: {
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
    width: '40%',
    height: 50,
  },
  Icons: {
    alignSelf: 'center',
  },
  texts: {
    margin: 3,
    fontSize: 19,
    fontFamily: 'Admin',
    marginHorizontal: 15,
  },
  textsCurrencyies: {
    margin: 3,
    fontSize: 19,
    fontFamily: 'Admin',
    marginHorizontal: 15,
    left: '80%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    top: '80%',
    backgroundColor: '#0288D1',
  },
  rnmodalView: {
    width: '85%',
    height: 150,
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 14,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default Dashboard;
