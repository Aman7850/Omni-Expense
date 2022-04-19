import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  Button,
  Title,
  Text,
  TextInput,
  Appbar,
  Dialog,
  Portal,
  Card,
  Divider,
} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';
import {db} from '../Database';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {SliderBox} from 'react-native-image-slider-box';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNModal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';



const DetailScreen = ({route, navigation}) => {
  const [isEditable, setisEditable] = useState(false);
  const [isSubmitted, setisSubmitted] = useState(true);
  const [isSave, setIsSave] = useState(false);
  const [isSub, setIsSub] = useState(false);
  const [Date, setDate] = useState('');
  const [DateSend, setDateSend] = useState('');
  const [Description, setDescription] = useState('');
  const [Employee, setEmployee] = useState('');
  const [paidBy, setpaidBy] = useState('');
  const [paidByFace, setPaidByFace] = useState('');
  const [products, setProducts] = useState('');
  const [product_face, setProduct_face] = useState();
  const [Expenseid, setExpenseid] = useState('');
  const [Expense_id, setExpense_id] = useState('');
  const [CustomerId, setCustomerId] = useState('');
  const [Total, setTotal] = useState('');
  const [Status, setStatus] = useState('');
  const [unitPrice, setUnitPrice] = useState(0);
  const [Quantity, setQuantity] = useState(0);
  const [imageUri, setimageUri] = useState([]);
  const [images, setimages] = useState([]);
  
  const [pickerProduct, setPickerProduct] = useState([]);
  const [CurrencyPicker, setCurrencyPicker] = useState([]);
  const [Currency, setCurrency] = useState('');
  const [CurrencySym, setCurrencySym] = useState('');

  const [imageIndex, setImageIndex] = useState('');
  const [imageIndexDatabase, setImageIndexDatabase] = useState([]);
  const [visible, setVisible] = useState(false);
  const [membershipId, setMembershipId] = useState('');
  const [password, setPassword] = useState('');
  const [rnmodalVisible, setRNModalVisible] = useState(false);
  const [modVisible, setModVisible] = useState(false);
  const [ExpenseReference, setExpenseReference] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  
  const [load, setload] = useState(true);
  const [Asyncurl, setAsyncurl] = useState('');
  const [ExpenseRights, setExpenseRights] = useState('');
  const [base64img, setbase64img] = useState('');
  const [Uid, setUid] = useState('');
  
  const [inputValue, setInputValue] = useState(false);
  const [spinLoader, setSpinLoader] = useState(false);
  const [spinLoaderTwo, setSpinLoaderTwo] = useState(false);
  const [modDelete, setModDelete] = useState(false);
  const [deletePro, setdeletePro] = useState(false);
  const [QuantityShow, setQuantityShow] = useState('');
  const [unitPriceShow, setunitPriceShow] = useState('');
  const [submittedBy, SetsubmittedBy] = useState('');
  const imageList = [];
  const idArray = [];
  const apiimage = [];

  useEffect(() => {
    setProducts(route.params.Products);

    if (route.params.Products !== '') {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT Products FROM Omni_Products where id='${route.params.Products}'`,
          [],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setProduct_face(temp[0].Products);
          },
        );
      });
    } else {
      setProduct_face('--Select Products--');
    }
    setCurrencySym(route.params.CurrencySymbol);
    db.transaction(tx => {
      
      tx.executeSql(
        `SELECT Currency FROM Omni_Currency where id='${route.params.CurrencySymbol}'`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setCurrency(temp[0].Currency);
        },
      );
    });
    setSpinLoader(true);
    let allimages = [];
    console.log(route.params.Photo_id, 'photoid on detail');
    db.transaction(tx => {
      tx.executeSql(
        `SELECT Expense_Images,id FROM Omni_Expense_Image where Parent_id='${route.params.Customer_id}'`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
            var base64Icon = `data:image/png;base64,${temp[i].Expense_Images}`;
            var fordb = temp[i].id;
            var apiimagess = temp[i].Expense_Images;
            allimages.push(base64Icon);
            idArray.push(fordb);
            apiimage.push(apiimagess);
          }
          
          setimages(allimages);
          setSpinLoader(false);
          setImageIndexDatabase(idArray);
          setbase64img(apiimage);
        },
      );
    });

    setCustomerId(route.params.Customer_id);
    setDescription(route.params.Description);
    setTotal(route.params.Total);
    setDate(route.params.CreatedDate);
    setProducts(route.params.Products);
    setUnitPrice(route.params.unitPrice);
    setunitPriceShow(route.params.unitPrice);
    setQuantity(route.params.Quantity);
    setQuantityShow(route.params.Quantity);
    setpaidBy(route.params.PaidBy);
    paidbye(route.params.PaidBy);
    setStatus(route.params.Status);
    Statusformat(route.params.Status);
    setExpenseid(route.params.ExpenseId);
    setExpenseReference(route.params.ExpenseReference);
    SetsubmittedBy(route.params.submittedBy);
    editwithstatus(route.params.Status);
  }, []);

  useEffect(() => {
    setload(true);
    getData();
    if (!Expenseid == '') {
      handleStatus();
    }

    return () => {
      getData();
      
      ExpenseRights;
      
    };
    
  }, [ExpenseRights]);

  const getData = async () => {
    try {
      const ur = await AsyncStorage.getItem('Url');
      const em = await AsyncStorage.getItem('email');
      const pas = await AsyncStorage.getItem('password');
      const mem = await AsyncStorage.getItem('Membership');
      const Exp_Right = await AsyncStorage.getItem('ExpenseRights');
      const u_id = await AsyncStorage.getItem('uID');
      
      setEmployee(em);
      setMembershipId(mem);
      setExpenseRights(Exp_Right);
      setUid(u_id);
      setAsyncurl(ur);
      setPassword(pas);

      if (Exp_Right !== null) {
        setpaidBy('company_account');
      }
      if (Exp_Right == null) {
        setpaidBy('own_account');
      }
    } catch (e) {
     
    }
  };

  const editwithstatus = sta => {
    if (sta == 'refused') {
      setisSubmitted(false);
    } else if (sta == 'draft') {
      setisSubmitted(true);
    } else if (sta == 'approved') {
      setisSubmitted(false);
    } else if (sta == 'reported') {
      setisSubmitted(false);
    } else if (sta == 'submitted') {
      setisSubmitted(false);
    } else if (sta == 'done') {
      setisSubmitted(false);
    } else {
      setisSubmitted(true);
    }
  };

  const changeColorTitleUnitprice = () => {
    if (inputValue == false) {
      return 'black';
    } else {
      if (unitPrice == '') {
        return 'red';
      } else {
        return 'black';
      }
    }
  };
  const changeColorTitleQuantity = () => {
    if (inputValue == false) {
      return 'black';
    } else {
      if (Quantity == '') {
        return 'red';
      } else {
        return 'black';
      }
    }
  };
  const changeColorTitlePaidon = () => {
    if (inputValue == false) {
      return 'black';
    } else {
      if (Date == '') {
        return 'red';
      } else {
        return 'black';
      }
    }
  };
  const changeColorTitlePaidBy = () => {
    if (inputValue == false) {
      return 'black';
    } else {
      if (paidBy == '') {
        return 'red';
      } else {
        return 'black';
      }
    }
  };
  const changeColorTitleReference = () => {
    if (inputValue == false) {
      return 'black';
    } else {
      if (ExpenseReference == '') {
        return 'red';
      } else {
        return 'black';
      }
    }
  };

  const changeColorTitleDescription = () => {
    if (inputValue == false) {
      return 'black';
    } else {
      if (Description == '') {
        return 'red';
      } else {
        return 'black';
      }
    }
  };
  const changeColorTitleProducts = () => {
    if (inputValue == false) {
      return 'black';
    } else {
      if (products == '') {
        return 'red';
      } else {
        return 'black';
      }
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
let ApprovalStatus;
  const Approvals = () => {
    ApprovalStatus = true
    handleApproval();
  };

  const Reject = () => {
    console.log(isEditable, 'remove');
    ApprovalStatus = false
    handleApproval();
  };

  const deleteRecord = () => {
    setdeletePro(true);
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM Omni_Expense where Customer_id=?',
        [CustomerId],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            setdeletePro(false);
            navigation.navigate('ExpenseList');
          }
        },
      );
    });
  };

  const currencysymbol = curry => {
    setCurrencySym(curry);
    db.transaction(tx => {
      tx.executeSql(
        `SELECT Currency FROM Omni_Currency where id='${curry}'`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setCurrency(temp[0].Currency);
          
        },
      );
    });
  };

  const handleStatus = async () => {
    
    const response45 = await fetch(Asyncurl + '/o2b/omini/expense/status', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        params: {
          membership_id: membershipId,
          expense_id: Expenseid,
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
    setStatus(obje);
    editStatus(obje);
  };

  const handleImagedb = () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM Omni_Expense where Customer_id='${CustomerId}'`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          console.log(temp, 'here we are!');
        },
      );
    });
  };

  const hideDialog = () => setVisible(false);

  const paidbye = paidby => {
    switch (paidby) {
      case 'own_account':
        setPaidByFace('Employee');
        setpaidBy('own_account');
        break;
      case 'company_account':
        setPaidByFace('Company');
        setpaidBy('company_account');
        break;
    }
  };

  const handleinputs = async () => {
    if (typeof unitPrice == 'number' && typeof Quantity == 'number') {
      if (
        products !== '' &&
        Description !== '' &&
        Quantity !== '' &&
        unitPrice !== '' &&
        Date !== '' &&
        paidBy !== '' &&
        ExpenseReference !== ''
      ) {
        setIsSub(true);
        setisSubmitted(false);
        const responseinput = await fetch(
          Asyncurl + '/o2b/omini/expense/submit',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              params: {
                membership_id: membershipId,
                user: Employee,
                product_id: parseInt(products),
                name: Description,
                quantity: Quantity,
                unit_amount: unitPrice,
                date: Date,
                payment_mode: paidBy,
                attachments: base64img,
                reference: ExpenseReference,
                uid: Uid,
              },
            }),
          },
        );

        const jsoninput = await responseinput.json();
        
        const x = jsoninput.result;
        
        console.log(typeof jsoninput.result, 'data.result type');
        const trimstr = x.slice(1, -1);
        
        const strtoArr = trimstr.split(':');
        const expId = strtoArr[1];
        
        setExpense_id(expId);
        
        db.transaction(tx => {
          tx.executeSql(
            `UPDATE Omni_Expense set ExpenseId='${expId}' where Customer_id='${CustomerId}'`,
            [],
            (tx, results) => {},
          );
        });
        
        const responseStatus = await fetch(
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
                membership_id: membershipId,
                expense_id: expId,
              },
            }),
          },
        );
        const jsonStatus = await responseStatus.json();
       
        const todata = jsonStatus.result;
        const obj = JSON.parse(todata);
        
        var obje = obj.status;
        
        if (obje == 'reported') {
          obje = 'submitted';
        }

        db.transaction(tx => {
          tx.executeSql(
            `UPDATE Omni_Expense SET Status='${obje}' where Customer_id='${CustomerId}'`,
            [],
            (tx, results) => {
              
              if (results.rowsAffected > 0) {
                
              }
            },
          );
        });
        setStatus(obje);
        setModVisible(true);
        setIsSub(false);
       
      } else {
        setInputValue(true);
        Alert.alert('Fill all the Required Data!');
      }
    } else {
      Alert.alert('Enter Correct Data!');
    }
  };

  const handleApproval = async () => {
    const url = Asyncurl + '/o2b/omini/expense/approve';

    const response122 = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        params: {
          membership_id: membershipId,
          expense_id: Expenseid,
          app_status: ApprovalStatus,
          uid: Uid,
        },
      }),
    });

    const json122 = await response122.json();

    
    const todata = json122.result;
    const obj = JSON.parse(todata, 'sattus update!');
    
    const obje = obj.status;
    
    editStatus(obje);
    setStatus(obje);
   
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    const g = JSON.stringify(date);
    const g_send = g.slice(1, 11).split('-');

    const d = g_send[2];
    const m = g_send[1];
    const y = g_send[0];
    const g_date_show = m + '/' + d + '/' + y;

    setDateSend(g_date_show);

    
    setDate(g_date_show);
    hideDatePicker();
  };

  const edit = () => {
    viewCurrency();
    setisEditable(true);
  };
  const save = () => {
    editData();
  };

  const submithg = () => {
    if (!isSubmitted) {
      return '150%';
    }
  };

  const rowallimages = [];
  const imagedb = [];

  const editStatus = obje => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE Omni_Expense SET Status='${obje}' where Customer_id='${CustomerId}'`,
        [],
        (tx, results) => {
          
          if (results.rowsAffected > 0) {
            
          }
        },
      );
    });
    viewStatus();
  };

  const viewStatus = () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT Status FROM Omni_Expense where Customer_id='${CustomerId}'`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          
        },
      );
    });
    handleStatus();
  };
  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      multiple: true,
      includeBase64: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
      cropping: true,
      mediaType: 'any',
      maxFiles: 10,
      
    }).then(images => {
      
      images.map(img => {
        imageList.push({
          data: img.data,
        });
      });
      
      Settings(imageList);
    });
  };

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      multiple: true,
      includeBase64: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
      cropping: true,
      mediaType: 'any',
      maxFiles: 10,
      
    }).then(images => {
      
      imageList.push({
        data: images.data,
      });

      Settings(imageList);
    });
  };

  const editData = () => {
    setIsSave(true);
    const T = (unitPrice * Quantity).toFixed(2);
    editImageDataBase();
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE Omni_Expense set Description='${Description}', Products='${products}' , unitPrice='${unitPrice}' , Quantity='${Quantity}', Total='${T}', CreatedDate='${Date}',PaidBy='${paidBy}',CurrencySymbol='${CurrencySym}',ExpenseReference='${ExpenseReference}' where Customer_id='${CustomerId}'`,
        [],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            setIsSave(false);
            setisEditable(false);
            
          }
        },
      );
    });
  };

  const editImageDataBase = () => {
    
    db.transaction(tx => {
      for (let i = 0; i < imageUri.length; ++i) {
        tx.executeSql(
          `INSERT INTO Omni_Expense_Image(Expense_Images,Parent_id) VALUES('${imageUri[i]}','${CustomerId}')`,
          [],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              console.log(
                'Record Updated Successfully... in OmniExpenseImages',
              );
            } else console.log('Error');
          },
        );
      }
    });
    
  };

  const viewCurrency = () => {
    setSpinLoaderTwo(true);
    db.transaction(tx => {
      tx.executeSql(
        `SELECT id,Currency FROM Omni_Currency ORDER BY id='${CurrencySym}' DESC`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));

          setCurrencyPicker(temp);
          setSpinLoaderTwo(false);
          tx.executeSql(
            `SELECT id,Products FROM Omni_Products ORDER BY id='${products}' DESC`,
            [],
            (tx, results) => {
              var temp2 = [];
              for (let i = 0; i < results.rows.length; ++i)
                temp2.push(results.rows.item(i));

              setPickerProduct(temp2);
            },
          );
         
        },
      );
    });
  };

  const QuantityChange = value => {
    setQuantity(parseInt(value));
    setQuantityShow(value);
  };

  const UpriceChange = value => {
    setUnitPrice(parseInt(value));
    setunitPriceShow(value);
  };

  const Settings = imageList => {
    
    for (let i = 0; i < imageList.length; i++) {
      var base64Icon = `data:image/png;base64,${imageList[i].data}`;
      var fordb = imageList[i].data;
      rowallimages.push(base64Icon);
      base64img.push(fordb);
      imagedb.push(fordb);
    }
    setimageUri(imagedb);
    setimages(images.concat(rowallimages));
   
  };

  const deleteImage = () => {
    setVisible(true);

    const index = parseInt(imageIndex);

    const p = imageIndexDatabase[index];

    if (index > 0) {
      images.splice(index, 1);
      imageIndexDatabase.splice(index, 1);
      db.transaction(tx => {
        tx.executeSql(
          ` DELETE FROM Omni_Expense_Image where id='${p}'`,
          [],
          (tx, results) => {
            if (results.rowsAffected > 0) {
            }
          },
        );
      });
      imageUri.splice(index, 1);
    } else {
      Alert.alert("You can't delete this Image");
    }

    setVisible(false);
  };

  const deletepre = () => {
    setVisible(true);
  };

  const cardheight = () => {
    if (isEditable) {
      return 550;
    } else {
      return 450;
    }
  };

  const FindProduct = prod => {
    
    setProducts(prod);
    if (prod !== '') {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT Products FROM Omni_Products where id='${prod}'`,
          [],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setProduct_face(temp[0].Products);
          },
        );
      });
    } else {
      setProduct_face('--Select Products--');
    }
  };

  return (
    <>
      <Appbar.Header
        style={{alignContent: 'center', backgroundColor: '#3D5AFE'}}>
        <Appbar.BackAction onPress={() => navigation.navigate('ExpenseList')} />
        <Appbar.Content title="Expense Details" titleStyle={{color: 'white'}} />
        <Appbar.Action icon="delete" onPress={() => setModDelete(true)} />
      </Appbar.Header>

      <Text style={styles.textInputshid}>{ExpenseRights}</Text>

      <ScrollView style={styles.container}>
        <Card
          style={{
            marginTop: 20,
            marginBottom: 5,
            marginLeft: 10,
            marginRight: 10,
            borderRadius: 20,
            padding: 10,
            width: '95%',
            height: 450,
          }}>
          {spinLoader ? (
            <View>
              <ActivityIndicator
                size="large"
                color="#0000ff"
                animating={spinLoader}
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  top: '500%',
                }}
              />
            </View>
          ) : (
            <View>
              <SliderBox
                images={images}
                sliderBoxHeight={450}
                currentImageEmitter={index => setImageIndex(index)}
                dotColor="#FFEE58"
                inactiveDotColor="#90A4AE"
                resizeMethod={'resize'}
                resizeMode={'cover'}
                ImageComponentStyle={{
                  width: '90%',
                  right: 20,
                  borderRadius: 20,
                }}
              />
            </View>
          )}
        </Card>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <View>
            {isEditable && isSubmitted ? (
              <TouchableOpacity onPress={() => setRNModalVisible(true)}>
                <Icon name="image-plus" size={42} style={styles.Icons} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity disabled>
                <Icon name="image-plus" size={42} style={styles.Icons} />
              </TouchableOpacity>
            )}
          </View>
          <View>
            <Title
              style={{
                color: Statusformat(Status),
                textTransform: 'capitalize',
              }}>
              {Status}
            </Title>
          </View>

          <View>
            {isEditable && isSubmitted ? (
              <TouchableOpacity onPress={deletepre}>
                <Icon name="image-remove" size={40} style={styles.Icons} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity disabled>
                <Icon name="image-remove" size={40} style={styles.Icons} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Card
          style={{
            padding: 10,
            marginHorizontal: 10,
            borderRadius: 20,
            width: '95%',
            height: cardheight(),
          }}>
          {spinLoaderTwo ? (
            <View>
              <ActivityIndicator
                size="large"
                color="#0000ff"
                animating={spinLoaderTwo}
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  top: '550%',
                }}
              />
            </View>
          ) : (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                {isEditable && isSubmitted ? (
                  <Picker
                    style={styles.picker}
                    mode="dropdown"
                    selectedValue={product_face}
                    onValueChange={value => FindProduct(value)}>
                    
                    {pickerProduct !== '' ? (
                      pickerProduct.map(pickerProduct => {
                        return (
                          <Picker.Item
                            label={pickerProduct.Products}
                            key={pickerProduct.id}
                            value={pickerProduct.id}
                          />
                        );
                      })
                    ) : (
                      <Picker.Item label="Loading..." value="0" />
                    )}
                  </Picker>
                ) : (
                  <Title
                    style={{
                      marginTop: 15,
                      marginBottom: 5,
                      alignSelf: 'center',
                    }}>
                    {product_face}
                  </Title>
                )}
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View>
                  <Title
                    style={{
                      alignSelf: 'center',
                      color: changeColorTitleQuantity(),
                    }}>
                    Quantity:
                  </Title>
                  {isEditable && isSubmitted ? (
                    <TextInput
                      style={styles.textInputsQuantity}
                      value={String(QuantityShow)}
                      mode="outlined"
                      maxLength={6}
                      keyboardType="numeric"
                      theme={{
                        colors: {
                          text: 'black',
                          accent: '#ffffff',
                          primary: 'black',
                          placeholder: 'black',
                        },
                      }}
                      underlineColor="black"
                      onChangeText={value => QuantityChange(value)}
                    />
                  ) : (
                    <Text style={styles.TextI}>{Quantity}</Text>
                  )}
                </View>
                {isEditable && isSubmitted ? (
                  <Picker
                    style={{
                      backgroundColor: '#FFFFFF',
                      transform: [{scaleY: 1.2}],
                      width: '33%',
                      left: '80%',
                      top: '5%',
                    }}
                    mode="dropdown"
                    selectedValue={Currency}
                    onValueChange={itemValue => {
                      currencysymbol(itemValue);
                    }}>
                    {CurrencyPicker !== '' ? (
                      CurrencyPicker.map(currency => {
                        return (
                          <Picker.Item
                            label={currency.Currency}
                            key={currency.id}
                            value={currency.id}
                          />
                        );
                      })
                    ) : (
                      <Picker.Item label="Loading..." value="0" />
                    )}
                  </Picker>
                ) : (
                  <View>
                    {/* <Text style={[styles.TextICurrencyshow]}>{Currency}</Text> */}
                  </View>
                )}
                <View>
                  <Title
                    style={{
                      alignSelf: 'center',
                      marginRight: 20,
                      color: changeColorTitleUnitprice(),
                    }}>
                    U.Price:
                  </Title>

                  <View>
                    {isEditable && isSubmitted ? (
                      <TextInput
                        style={styles.textInputsUnit}
                        value={String(unitPriceShow)}
                        mode="outlined"
                        maxLength={6}
                        keyboardType="numeric"
                        theme={{
                          colors: {
                            text: 'black',
                            accent: '#ffffff',
                            primary: 'black',
                            placeholder: 'black',
                          },
                        }}
                        underlineColor="black"
                        onChangeText={value => UpriceChange(value)}
                      />
                    ) : (
                      <Text style={styles.TextI}>
                        {Currency} {unitPrice}{' '}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              <Divider style={{borderColor: '#90CAF9', borderWidth: 0.5}} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Title
                  style={{
                    alignSelf: 'center',
                    color: changeColorTitlePaidon(),
                  }}>
                  Paid On:
                </Title>
                {isEditable && isSubmitted ? (
                  <View
                    style={{
                      width: '35%',
                      backgroundColor: '#90CAF9',
                      right: '50%',
                      height: '80%',
                      borderRadius: 7,
                      marginVertical: '2%',
                    }}>
                    <View>
                      <TouchableOpacity onPress={showDatePicker}>
                        <Text style={{fontSize: 20, alignSelf: 'center'}}>
                          {Date}
                        </Text>
                      </TouchableOpacity>
                      <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        display="spinner"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                      />
                    </View>
                  </View>
                ) : (
                  <Text style={[styles.uppertexts, {alignSelf: 'center'}]}>
                    {Date}
                  </Text>
                )}
              </View>
              <Divider style={{borderColor: '#90CAF9', borderWidth: 0.5}} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginVertical: 10,
                }}>
                <Title
                  style={{
                    alignSelf: 'center',
                    color: changeColorTitlePaidon(),
                  }}>
                  Submitted By:
                </Title>
                <Text style={[styles.uppertexts, {alignSelf: 'center'}]}>
                  {submittedBy}
                </Text>
              </View>
              <Divider style={{borderColor: '#90CAF9', borderWidth: 0.5}} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}>
                <Title
                  style={{
                    alignSelf: 'center',
                    color: changeColorTitlePaidBy(),
                  }}>
                  Paid By:
                </Title>
                {isEditable && isSubmitted ? (
                  ExpenseRights == null ? (
                    <Picker
                      style={styles.pickerpaid}
                      mode="dropdown"
                      selectedValue={paidBy}
                      onValueChange={itemValue => setpaidBy(itemValue)}>
                      <Picker.Item label="Employee" value="own_account" />
                    </Picker>
                  ) : (
                    <Picker
                      style={styles.pickerpaid}
                      mode="dropdown"
                      selectedValue={paidBy}
                      onValueChange={itemValue => setpaidBy(itemValue)}>
                      <Picker.Item label="Company" value="company_account" />
                      <Picker.Item label="Employee" value="own_account" />
                    </Picker>
                  )
                ) : (
                  <Text style={[styles.TextI, {alignSelf: 'center'}]}>
                    {paidByFace}
                  </Text>
                )}
              </View>

              <Divider style={{borderColor: '#90CAF9', borderWidth: 0.5}} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}>
                <Title
                  style={{
                    alignSelf: 'center',
                    color: changeColorTitleReference(),
                  }}>
                  Reference:
                </Title>
                {isEditable && isSubmitted ? (
                  <TextInput
                    style={styles.textInputs}
                    value={ExpenseReference}
                    theme={{
                      colors: {
                        text: 'black',
                        accent: '#ffffff',
                        primary: 'black',
                        placeholder: 'black',
                        
                      },
                    }}
                    underlineColor="black"
                    onChangeText={value => setExpenseReference(value)}
                  />
                ) : (
                  <Title
                    style={{
                      marginTop: 10,
                      marginBottom: 5,
                      alignSelf: 'center',
                    }}>
                    {ExpenseReference}
                  </Title>
                )}
              </View>

              <Divider style={{borderColor: '#90CAF9', borderWidth: 0.5}} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}>
                <Title
                  style={{
                    alignSelf: 'center',
                    color: changeColorTitleDescription(),
                  }}>
                  Desc:
                </Title>
                {isEditable && isSubmitted ? (
                  <TextInput
                    style={styles.textInputs}
                    value={Description}
                    theme={{
                      colors: {
                        text: 'black',
                        accent: '#ffffff',
                        primary: 'black',
                        placeholder: 'black',
                        
                      },
                    }}
                    underlineColor="black"
                    onChangeText={value => setDescription(value)}
                  />
                ) : (
                  <Title
                    style={{
                      marginTop: 10,
                      marginBottom: 5,
                      alignSelf: 'center',
                    }}>
                    {Description}
                  </Title>
                )}
              </View>

              <Divider style={{borderColor: '#90CAF9', borderWidth: 0.5}} />
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{alignContent: 'center'}}>
                  <Title style={{alignSelf: 'center'}}>Total:</Title>
                </View>
                <View style={{alignContent: 'center'}}>
                  <Title style={{alignSelf: 'center'}}>
                    {Currency} {(unitPrice * Quantity).toFixed(2)}{' '}
                  </Title>
                </View>
              </View>
            </>
          )}
        </Card>
        
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
            
          {isEditable && isSubmitted ? (
            isSave ? (
              <ActivityIndicator color="red" animating={isSave} />
            ) : (
              <Button mode="contained" onPress={save}>
                Save
              </Button>
            )
          ) : (
            <View style={{display: 'none'}}></View>
          )}
            
              {!isSubmitted || isEditable ? (
              isSub ? (
                <View style={{display: 'none'}}></View>
              ) : (
                <ActivityIndicator size="small" color="red" animating={isSub} />
              )
            ) : (
              <Button style={{left: submithg()}} mode="contained" onPress={edit}>
              Edit 
            </Button>
          
            )}
         
          {!isSubmitted ? (
            isSub ? (
              <View style={{display: 'none'}}></View>
            ) : (
              <ActivityIndicator size="small" color="red" animating={isSub} />
            )
          ) : (
            <Button
              mode="contained"
              style={styles.button}
              onPress={handleinputs}>
              Submit
            </Button>
        
          )}
          
          {ExpenseRights !== null ? (
            Status == 'submitted' ? (
              <View
                style={{
                  flexDirection: 'row', marginTop:10, marginBottom: 10, alignItems: 'center'
                }}>
                <View>
                  <Button mode="contained" onPress={Approvals}>
                    Approve
                  </Button>
                </View>
                <View>
                  <Button
                    mode="contained"
                    onPress={Reject}
                    style={{left: '10%'}}>
                    Reject
                  </Button>
                </View>
              </View>
            ) : (
              <View style={{display: 'none'}}></View>
            )
          ) : (
            <View style={{display: 'none'}}></View>
          )}
        </View>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Delete Image?</Dialog.Title>
            <Dialog.Actions>
              <Button onPress={deleteImage}>Yes</Button>
              <Button onPress={hideDialog}>No</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <RNModal
          isVisible={rnmodalVisible}
          onBackdropPress={() => setRNModalVisible(false)}
          animationIn="zoomIn"
          animationOut="zoomOut">
          <View style={styles.rnmodalView}>
            <View style={{}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <TouchableOpacity onPress={takePhotoFromCamera}>
                  <Icon
                    name="camera-image"
                    size={60}
                    style={styles.IconsModal}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={choosePhotoFromLibrary}>
                  <Icon
                    name="folder-multiple-image"
                    size={60}
                    style={styles.Icons}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </RNModal>
        <RNModal
          isVisible={modVisible}
          onBackdropPress={() => setModVisible(false)}
          animationIn="zoomIn"
          animationOut="zoomOut">
          <View style={styles.rnmodalView}>
            <Title style={{alignSelf: 'center'}}>
              Your Expense Record is Submitted.
            </Title>
            <Button onPress={() => navigation.navigate('ExpenseList')}>
              OK
            </Button>
          </View>
        </RNModal>
        <RNModal
          isVisible={modDelete}
          onBackdropPress={() => setModDelete(false)}
          animationIn="zoomIn"
          animationOut="zoomOut">
          <View style={styles.rnmodalViewDEl}>
            <Title style={{alignSelf: 'center'}}>
              Do you want to delete this record?
            </Title>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
              }}>
              {deletePro ? (
                <ActivityIndicator
                  size="small"
                  color="#0000ff"
                  animating={deletePro}
                />
              ) : (
                <Button onPress={deleteRecord}>OK</Button>
              )}

              <Button onPress={() => setModDelete(false)}>Cancel</Button>
            </View>
          </View>
        </RNModal>
        
      </ScrollView>
    </>
  );
};
export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    backgroundColor: '#E3F2FD',
  },
  textInputs: {
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 18,
    width: '70%',
   
    height: 40,
    
  },
  textInputsQuantity: {
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 17,
    width: '100%',
    height: 40,
    textAlign: 'justify',
   
  },
  texts: {
    marginTop: 10,
    fontSize: 20,
  },
  button: {
    marginLeft:'-20%',
    marginVertical: 10,
  },
  picker: {
    
    width: '90%',
    backgroundColor: '#FFFFFF',
    transform: [{scaleY: 1.3}],
  },
  pickerpaid: {
    width: '50%',
    backgroundColor: '#FFFFFF',
    transform: [{scaleY: 1.3}],
    left: '80%',
  },
  textInputshid: {
    width: 0,
    height: 0,
    backgroundColor: 'red',
    flex: 0.001,
  },
  textInputsUnit: {
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 18,
    height: 40,
    width: '70%',
  },
  pickerCurrency: {
    backgroundColor: '#FFFFFF',
    transform: [{scaleY: 1.2}],
    width: '80%',
    
  },
  uppertexts: {
    fontSize: 18,
    marginHorizontal: 8,
    fontWeight: '500',
    marginVertical: 10,
  },
  TextI: {
    fontSize: 20,
    marginVertical: 5,
    alignSelf: 'center',
    margin: 1,
  },
  TextICurrencyshow: {
    fontSize: 20,
    marginVertical: 7,
    margin: 1,
    alignSelf: 'center',
    left: '850%',
    top: '23%',
  },
  userInfoSectionPro: {
    paddingHorizontal: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: 'black',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  Icons: {
    alignSelf: 'center',
  },
  IconsModal: {
    alignSelf: 'center',
    color: 'black',
  },
  rnmodalView: {
    width: '85%',
    height: 150,
    alignSelf: 'center',
    justifyContent: 'center',
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
  rnmodalViewDEl: {
    width: '85%',
    height: 150,
    alignSelf: 'center',
    justifyContent: 'center',
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
  rnmodalViewNavigate: {
    width: '100%',
    height: 100,
    alignSelf: 'center',
    justifyContent: 'center',
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
  cards: {
    flex: 0,
    marginHorizontal: 10,
    marginVertical: 30,
    height: '30%',
  },
});
