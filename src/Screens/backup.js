import React, {useState, useEffect, createRef} from 'react';
import {
  StyleSheet,
  View,
  Alert,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Settings,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Button,
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
  TextInput,
  Appbar,
  Paragraph,
  Dialog,
  Portal,
  ProgressBar,
  Colors,
} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';
import {Header, Item} from 'native-base';
import {db} from '../Database';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import DatePicker from 'react-native-datepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SliderBox} from 'react-native-image-slider-box';
import {
  NavigationContainer,
  useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import ActionSheet from 'react-native-actions-sheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNModal from 'react-native-modal';
//camera-image   folder-multiple-image

const DetailScreen = ({route, navigation}) => {
  const [isEditable, setisEditable] = useState(false);
  const [isSubmitted, setisSubmitted] = useState(true);
  const [Date, setDate] = useState('');
  const [Description, setDescription] = useState('');
  const [Employee, setEmployee] = useState('');
  const [paidBy, setpaidBy] = useState('');
  const [paidByFace, setPaidByFace] = useState('');
  const [products, setProducts] = useState('');
  const [product_face, setProduct_face] = useState();
  const [Expenseid, setExpenseid] = useState(0);
  const [Expense_id, setExpense_id] = useState('');
  const [CustomerId, setCustomerId] = useState('');
  const [Total, setTotal] = useState('');
  const [Status, setStatus] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [Quantity, setQuantity] = useState('');
  const [taxes, setTaxes] = useState('');
  const [imageUri, setimageUri] = useState([]);
  const [images, setimages] = useState([]);
  const [editImageUri, setEditImageUri] = useState([]);
  const [user, setUser] = useState('admin');
  const [pickerProduct, setPickerProduct] = useState([]);
  const [CurrencyPicker, setCurrencyPicker] = useState([]);
  const [Currency, setCurrency] = useState('');
  //const [CurrencySymbol, setCurrencySymbol] = useState('');
  const [imageIndex, setImageIndex] = useState('');
  const [imageIndexDatabase, setImageIndexDatabase] = useState([]);
  const isFocused = useIsFocused();
  const actionSheetRef = createRef();
  const [visible, setVisible] = useState(false);
  const [membershipId, setMembershipId] = useState('');
  const [password, setPassword] = useState('');
  const [Photo_id, setPhoto_id] = useState(0);
  const [rnmodalVisible, setRNModalVisible] = useState(false);
  //const [loading, setLoading] = useState(true);
  const [handler, sethandler] = useState([]);
  const imageList = [];
  const idArray = [];

  useEffect(() => {
    //console.log('hello do!');
    // handleImagedb();
    setCustomerId(route.params.Customer_id);
    setDescription(route.params.Description);
    setTotal(route.params.Total);
    setPhoto_id(route.params.Photo_id);
    setDate(route.params.CreatedDate);
    setProducts(route.params.Products);
    //console.log(products, 'checcking products i useEffect');
    FindProduct(route.params.Products);
    setUnitPrice(route.params.unitPrice);
    setQuantity(route.params.Quantity);
    setpaidBy(route.params.PaidBy);
    paidbye(route.params.PaidBy);
    setStatus(route.params.Status);
    setExpenseid(route.params.ExpenseId);
    currencysymbol(route.params.CurrencySymbol);

    //imagehandler(route.params.Expense_Images);
    imagehandler(route.params.Customer_id);
    //console.log(route.params.CurrencySymbol, 'check Currencysymbol!');
    editwithstatus(route.params.Status);

    // imagehandler();
    // setExpenseid(route.params.Expense_id);
    // console.log(imageUri[2], 'passed from prev screen!');
    // console.log(editImageUri.length, 'passed from prev screen!');
  }, []);

  useEffect(() => {
    getData();
    viewExpense();
    handleProducts();
    handleCurrency();
  }, [isFocused]);

  //console.log('dormamu ! i have come to bargain!');

  const editwithstatus = sta => {
    if (sta == 'refused') {
      setisSubmitted(true);
    } else if (sta == 'draft') {
      setisSubmitted(false);
    } else if (sta == 'approved') {
      setisSubmitted(false);
    } else if (sta == 'reported') {
      setisSubmitted(false);
    } else if (sta == 'paid') {
      setisSubmitted(false);
    } else {
      setisSubmitted(true);
    }
  };

  const currencysymbol = curry => {
    db.transaction(tx => {
      console.log('below switch case func');
      tx.executeSql(
        `SELECT Currency FROM Omni_Currency where id='${curry}'`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          console.log(temp[0].Currency, 'currency  daatbase');
          setCurrency(temp[0].Currency);
          //setPickerProduct(temp);
        },
      );
    });
  };

  const handleStatus = () => {
    const url = 'https://demo.o2btechnologies.com/o2b/omini/expense/status';
    fetch(url, {
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
    })
      .then(res => res.json())
      .then(async data => {
        // console.log('gj,hhjb', data);
        const todata = data.result;
        const obj = JSON.parse(todata, 'sattus update!');
        // console.log('type of todata', typeof todata);
        // console.log('type of obj', typeof obj);
        // console.log('checking Object!', obj.status);
        const obje = obj.status;
        //console.log(obje, 'chcking obje in handle status');
        setStatus(obje);

        editStatus(obje);
      })
      .catch(e => {
        //setIsLoading(false);
        console.log(e);
        console.log('error status');
      });
  };

  const imagehandler = pro => {
    console.log(pro, ' pro   here we are');
    let allimages = [];
    //allimages.push(`data:image/png;base64,${pro}`);
    db.transaction(tx => {
      tx.executeSql(
        `SELECT Expense_Images,id FROM Omni_Expense_Image where Parent_id='${pro}'`,
        [],
        (tx, results) => {
          //console.log(results.rows.length, 'checking results directly');
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
            var base64Icon = `data:image/png;base64,${temp[i].Expense_Images}`;
            var fordb = temp[i].id;
            allimages.push(base64Icon);
            idArray.push(fordb);
          }
          // console.log(allimages, 'aryan123');
          // console.log(allimages.length, 'aryan123');
          // console.log(typeof allimages);
          setimages(allimages);
          setImageIndexDatabase(idArray);
          //setimageUri(databaseimage);
          // allimages.push(`data:image/png;base64,${temp[i].Expense_Images}`);
          // console.log(idArray, 'kolkata');
          // console.log(idArray.length, 'aryan1234567');
          // console.log(typeof idArray);
        },
      );
    });

    //let y = [];
    // for (let i = 0; i < imageUri.length; i++) {
    //   var base64Icon = `data:image/png;base64,${imageUri[i]}`;
    //   // var x = results.rows.item(i);
    //   allimages.push(base64Icon);
    //   // y.push(x);
    // }

    //console.log('here we go', allimages, 'here we are with image');
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

    //console.log('dormamu ! i have come to bargain!');
    // db.transaction(tx => {
    //   tx.executeSql(
    //     `SELECT * FROM Omni_Expense WHERE Customer_id='${CustomerId}'`,
    //     [],
    //     (tx, results) => {
    //       //console.log(results.rows.item, 'type of results!');
    //       var len = results.rows.length;
    //       console.log(results.rows.item);
    //       if (len >= 0) {
    //         // let allimages = [];
    //         // let y = [];
    //         // for (let i = 0; i < len; i++) {
    //         //   var base64Icon = `data:image/png;base64,${results.rows.item(i)}`;
    //         //   var x = results.rows.item(i);
    //         //   allimages.push(base64Icon);
    //         //   y.push(x);
    //         // }
    //         // const imagedatastr = y[0].Photo;
    //         // console.log(imagedatastr, 'we are groot!');
    //         //Settingsds(y);
    //         // const imagedatastr = y[0].Photo;
    //         // const objfromstr = JSON.parse(imagedatastr);
    //         // console.log('IDkkkkkkkkkkkkkkkkkkkkkkkk');
    //         // console.log(objfromstr, 'IDkkkkk');
    //         //setimages(allimages);
    //         //const cleanimg = [];
    //         //console.log(y[0].Photo, 'IDk');
    //         const split = y[0].Photo.split(',');
    //         //console.log(split.length, 'length of img array!');
    //         //console.log(split[0].length, 'length of one image element');
    //         //console.log(split.indexOf(split[2]))
    //         // for (let i = 0; i <= split.length; i++) {
    //         //   if (split[i].length < 25) {
    //         //     split.splice(split[i], 1);
    //         //   }
    //         // }
    //         const map1 = split.map(x => `data:image/png;base64,${x}`);
    //         //console.log(split, 'india india');
    //         console.log(typeof map1, 'india india');
    //         setimages(map1);
    //         //setimageUri(split);
    //         //setimageUri(cleanimg);
    //         //console.log(split, 'india');
    //         // var rv = {};
    //         // for (var i = 0; i < split.length; ++i)
    //         //   rv[i] = arr[i];
    //         // return rv;
    //       }
    //     },
    //   );
    // });
  };

  let actionSheet;

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const EOF = () => {
    //console.log(images, 'ahdnawkdnbwad');
    // const obj = JSON.parse(images);
    // console.log(obj, 'butch and sundance!');
  };

  const handleProducts = () => {
    //console.log('Black panther!');
    const url = 'https://demo.o2btechnologies.com/o2b/omini/products';
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        params: {
          membership_id: membershipId,
        },
      }),
    })
      .then(res => res.json())
      .then(async data => {
        //setdata(data.result);
        const myObj = data.result;
        const toJSON = JSON.parse(myObj);
        const toLOG = toJSON.products;
        // for (let i = 0; i < toLOG.length; i++) {
        //   pickerProduct.push(toLOG[i].name);
        // }
        insertProducts(toLOG);
      })
      .catch(e => {
        console.log(e);
        console.log('Kindly enter the correct credentials products!');
      });
  };

  const getData = async () => {
    try {
      const ur = await AsyncStorage.getItem('Url');
      const em = await AsyncStorage.getItem('email');
      const pas = await AsyncStorage.getItem('password');
      const mem = await AsyncStorage.getItem('Membership');
      if (ur !== null && em !== null && pas !== null) {
        // console.log('membershipid email and password on detail screen!');
        // console.log(mem, em);
        setMembershipId(mem);
        setEmployee(em);
        setPassword(pas);
      }
    } catch (e) {
      // error reading value
    }
  };

  const insertProducts = toLOG => {
    console.log('data about to be inserted in products');
    for (let i = 0; i < toLOG.length; i++) {
      db.transaction(function (tx) {
        tx.executeSql(
          `INSERT INTO Omni_Products(Products,id) VALUES('${toLOG[i].name}','${toLOG[i].id}')`,
          (tx, results) => {
            console.log('Results', results.rowsAffected);

            if (results.rowsAffected > 0) {
              console.log('Data Inserted Successfully....');
            } else console.log('Failed');
          },
        );
      });
    }
    viewProducts();
  };

  const paidbye = paidby => {
    switch (paidby) {
      case 'own_account':
        setPaidByFace('Paid By Employee');
        setpaidBy('own_account');
        break;
      case 'company_account':
        setPaidByFace('Paid By Company');
        setpaidBy('company_account');
        break;
    }
  };

  const viewProducts = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Omni_Products', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        // console.log(temp);
        setPickerProduct(temp);
      });
    });
  };

  const handleinputs = () => {
    //setisSubmitted(false);
    const url = 'https://demo.o2btechnologies.com/o2b/omini/expense/submit';
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        params: {
          // membership_id: 'MEM00159',
          // user: user,
          // product_id: product_id,
          // name: Description,
          // quantity: Quantity,
          // unit_amount: unitPrice,
          // date: date,
          // payment_mode: paidBy,
          // attachments: imageUri,
          membership_id: membershipId,
          user: Employee,
          product_id: products,
          name: Description,
          quantity: Quantity,
          unit_amount: unitPrice,
          date: String(Date),
          payment_mode: paidBy,
          attachments: images,
        },
      }),
    })
      .then(res => res.json())
      .then(async data => {
        const x = data.result;
        console.log(data);
        //console.log(x, 'data.result');
        console.log(typeof data.result, 'data.result type');
        const trimstr = x.slice(1, -1);
        // console.log(trimstr, 'trim initial integer');
        const strtoArr = trimstr.split(':');
        const expId = strtoArr[1];
        // console.log(expId, 'expected expense id!');
        // console.log(typeof expId);
        setExpense_id(expId);
        // console.log(expId, CustomerId);
        editData(expId);
        // console.log(Expense_id, 'handle input!');
        //viewExpense();
      })
      .catch(e => {
        //setIsLoading(false);
        console.log(e);
        //alert('Kindly enter the correct credentials inputs!');
      });
  };

  const viewExpense = () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT ExpenseId FROM Omni_Expense where Customer_id='${CustomerId}'`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          //console.log(, 'view Epense');
          const expInteger = parseInt(temp[0].ExpenseId);
          // console.log(expInteger);
          // console.log(typeof expInteger, 'typeof');
          setExpenseid(expInteger);
          console.log(Expenseid, 'Expenseid');
          // console.log(typeof Expenseid, 'type of Expenseid');
          handleStatus();
        },
      );
    });
    //handleStatus();
  };

  const handleCurrency = () => {
    //console.log('inside handleCurrency');
    const url = 'https://demo.o2btechnologies.com/o2b/omini/currency';
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        params: {
          membership_id: membershipId,
          user: {
            login: Employee,
            password: password,
          },
        },
      }),
    })
      .then(res => res.json())
      .then(async data => {
        //console.log(data.result);
        const myObj = data.result;
        //console.log(myObj);
        //console.log(typeof myObj);
        const toJSON = JSON.parse(myObj);
        // console.log(typeof toJSON);
        // console.log(toJSON.currencies);
        const toLOG = toJSON.currencies;
        insertCurrencies(toLOG);
        // myObj = data.result;
        // console.log(myObj, 'jefnklhfuefiuoefsfee68e78e977tfye');
        //const toJSON = JSON.parse(myObj);
        //console.log(toJSON, 'converted to jsn inside handleCurrency!');
        //console.log(typeof toJSON, 'checking type of json');
      })
      .catch(e => {
        //setIsLoading(false);
        console.log(e);
        console.log('Kindly enter the correct credentials !Currency.');
      });
  };

  const edit = () => {
    setisEditable(true);
  };
  const save = () => {
    editData();
    setisEditable(false);
  };

  const refresh = () => {
    navigation.navigate('DetailScreen');
  };

  const MyComponent = () => (
    <ProgressBar progress={0.5} color={Colors.red800} />
  );

  const bs = React.createRef();
  const fall = new Animated.Value(1);

  const rowallimages = [];
  const imagedb = [];
  const oneimage = [];

  const editStatus = obje => {
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE Omni_Expense SET Status='${obje}' where Customer_id='${CustomerId}'`,
        [],
        (tx, results) => {
          //console.log('Results', results.rowsAffected);
          //console.log('hgwdgawhb');
          if (results.rowsAffected > 0) {
            //console.log('Record Updated Successfully...');
          } else console.log('Error');
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
          //console.log(temp, 'final destination!');
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
      compressImageQuality: 0.3,
    }).then(images => {
      //console.log(images, 'checking images');
      images.map(img => {
        imageList.push({
          data: img.data,
        });
      });
      //console.log(imageList[0].data);
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
      compressImageQuality: 0.3,
    }).then(images => {
      //console.log(images.data, 'checking images');
      imageList.push({
        data: images.data,
      });

      console.log(imageList, 'checking single image array');
      Settings(imageList);
    });
  };

  const editData = expId => {
    editImageDataBase();
    db.transaction(tx => {
      tx.executeSql(
        `UPDATE Omni_Expense set Description='${Description}', Products='${products}' , unitPrice='${unitPrice}' , Quantity='${Quantity}', Total='${Total}', CreatedDate='${Date}',ExpenseId='${expId}',PaidBy='${paidBy}',CurrencySymbol='${CurrencySymbol}' where Customer_id='${CustomerId}'`,
        [],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            console.log('Record Updated Successfully...in OmniExpense');
          } else console.log('Error');
        },
      );
    });
    //viewCustomers();
  };

  const editImageDataBase = () => {
    // console.log(imageUri[2], 'imagelist in editdatabaseiamge');
    // console.log(imageUri.length, 'imagelist in editdatabaseiamge');
    db.transaction(tx => {
      for (let i = 0; i < imageUri.length; ++i) {
        tx.executeSql(
          `INSERT INTO Omni_Expense_Image(Expense_Images,Parent_id) VALUES('${imageUri[i]}','${CustomerId}')`,
          [],
          (tx, results) => {
            console.log('Results Omin_Expense_image', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log(
                'Record Updated Successfully... in OmniExpenseImages',
              );
            } else console.log('Error');
          },
        );
      }
    });
    viewCustomers();
  };
  // , Products='${products}' , Quantity='${Quantity}', taxes='${taxes}', Total='${Total}', PaidBy='${paidBy}', Photo='${imageUri}' Date='${date}'
  // const editData = () => {
  //   console.log('inside edit data function!');
  //   db.transaction(tx => {
  //     tx.executeSql(
  //       `UPDATE Omni_Expense SET Description='${Description}', unitPrice='${unitPrice}', Quantity='${Quantity}', Total='${Total}', Photo='${imageUri}',Date='${Date}',ExpenseId='${Expense_id}', WHERE Customer_id='${CustomerId}'`,
  //       [],
  //       (tx, results) => {
  //         console.log('Resultswdawd', results.rowsAffected);
  //         console.log('pokerface!');

  //         if (results.rowsAffected > 0) {
  //           Alert.alert('Record Updated Successfully...');
  //         } else Alert.alert('Error');
  //       },
  //     );
  //   });
  //   ;
  // };

  // 'UPDATE Omni_Expense set Description=?, unitPrice=? , Quantity=?, Total=?, Photo=?, Date=? where Customer_id=?',
  // [Description, unitPrice, Quantity, Total, images, Date, CustomerId],

  // db.transaction(tx => {
  //   tx.executeSql(
  //     `UPDATE Omni_Expense SET Description='${Description}', WHERE Customer_id='${CustomerId}'`,
  //     [],
  //     (tx, results) => {
  //       console.log('Resultswdawd', results.rowsAffected);
  //       if (results.rowsAffected > 0) {
  //         Alert.alert('Record Updated Successfully...');
  //       } else Alert.alert('Error');
  //     },
  //   );
  // });

  const viewCustomers = () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM Omni_Expense where Customer_id='${CustomerId}'`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          //console.log(temp[0].Products);
          FindProduct(typeof temp[0].Products);
        },
      );
    });

    db.transaction(tx => {
      tx.executeSql(
        `SELECT Expense_Images FROM Omni_Expense_Image where Parent_id='${CustomerId}'`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          console.log(temp, 'aryan123');
          console.log(temp.length, 'aryan123');
          console.log(typeof temp);
          // FindProduct(typeof temp[0].Products);
        },
      );
    });
  };

  const insertCurrencies = toLOG => {
    //console.log('data about to be inserted');
    for (let i = 0; i < toLOG.length; i++) {
      db.transaction(function (tx) {
        tx.executeSql(
          `INSERT INTO Omni_Currency(Currency,id) VALUES('${toLOG[i].name}','${toLOG[i].id}')`,
          (tx, results) => {
            //console.log('Results', results.rowsAffected);

            if (results.rowsAffected > 0) {
              console.log('Data Inserted Successfully....');
            } else console.log('Failed');
          },
        );
      });
    }
    viewCurrency();
  };

  const viewCurrency = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Omni_Currency', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        //console.log(temp, 'Currencies in database!');
        setCurrencyPicker(temp);
      });
    });
  };

  const Settings = imageList => {
    //console.log(imageList, 'inside settings function!');
    //setimages(imageList);
    for (let i = 0; i < imageList.length; i++) {
      var base64Icon = `data:image/png;base64,${imageList[i].data}`;
      var fordb = imageList[i].data;
      rowallimages.push(base64Icon);
      imagedb.push(fordb);
    }
    setimageUri(imagedb);
    setimages(images.concat(rowallimages));
    //console.log(images);
    // setimages(rowallimages);

    //console.log(imagedb, 'hell');
    //console.log(imagedb.length, 'hell');

    //console.log(images, 'checking the other side! Bitch!');
    // console.log(imageUri, 'hello new react hooks!');
    // console.log(imageUri.length, 'hello new react hooks!');
    //console.log(imageUri, 'hello new react hooks!');
    // console.log(imageUri[], 'hello new react hooks!');
    //console.log(imageList[0].data, 'hello new react hooks!');
    // console.log(imageList.length, 'insidesettings');
    //console.log(typeof imagedb, 'insidesettingsjhawdjabwdjkwab');
    //const obj = JSON.parse();
  };

  const deleteImage = () => {
    setVisible(true);
    console.log(imageIndex, 'checking image index!');
    const index = parseInt(imageIndex);
    console.log(index, 'checking index');
    console.log(imageIndexDatabase, 'checking idarray');
    const p = imageIndexDatabase[index];

    console.log(p, 'checeking P');
    images.splice(index, 1);

    db.transaction(tx => {
      tx.executeSql(
        ` DELETE FROM Omni_Expense_Image where id='${p}'`,
        [],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          //var temp = [];
          // for (let i = 0; i < results.rows.length; ++i)
          //   temp.push(results.rows.item(i));
          // console.log(temp, 'aryan123');
          // console.log(temp.length, 'aryan123');
          // console.log(typeof temp);
          // // FindProduct(typeof temp[0].Products);
        },
      );
    });

    //imageUri.splice(index, 1);
    //console.log(images.length, 'here we left');
    //console.log(imageUri.length, 'here we left');
    setVisible(false);
  };

  const deletepre = index => {
    setVisible(true);
  };

  // const Settingsds = imageList => {
  //   console.log(imageList, 'inside settingsds function!');
  //   //setimages(imageList);
  //   for (let i = 0; i < imageList.length; i++) {
  //     var base64Icon = `data:image/png;base64,${imageList[i].Photo}`;
  //     //var fordb = imageList[i].data;
  //     rowallimages.push(base64Icon);
  //     imagedb.push(fordb);
  //   }
  //   setimages(rowallimages);
  //   //setimageUri(fordb);
  //   //console.log(imageUri, 'checking the other side!');
  //   //console.log(images, 'hello new react hooks!');
  //   // console.log(imageList[0].data, 'hello new react hooks!');
  //   // console.log(imageList.length, 'insidesettings');
  //   //console.log(typeof images, 'insidesettingsjhawdjabwdjkwab');
  //   //const obj = JSON.parse();
  // };

  const renderInner = () => (
    <View style={styles.panel}>
      <View style={{alignItems: 'center'}}>
        <Title>Upload Required Documents</Title>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={choosePhotoFromLibrary}>
        <Text style={styles.panelButtonTitle}>From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={takePhotoFromCamera}>
        <Text style={styles.panelButtonTitle}>From Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={takePhotoFromCamera}>
        <Text style={styles.panelButtonTitle}>Edit Image</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle}></View>
      </View>
    </View>
  );

  const editandDone = () => {
    getData();
    viewExpense();
    handleProducts();
    handleCurrency();
  };

  const FindProduct = prod => {
    db.transaction(tx => {
      console.log('below switch case func');
      tx.executeSql(
        `SELECT Products FROM Omni_Products where id='${prod}'`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          console.log(temp[0].Products, 'product daatbase');
          setProduct_face(temp[0].Products);
          //setPickerProduct(temp);
        },
      );
    });
  };

  const closemodal = () => {
    setRNModalVisible(false);

    //console.log(proper);
  };

  return (
    <>
      {/* <TouchableWithoutFeedback onPress={() => setRNModalVisible(false)}> */}
      <Appbar.Header
        style={{alignContent: 'center', backgroundColor: '#FFFFFF'}}>
        <Appbar.BackAction onPress={() => navigation.navigate('ExpenseList')} />
        <Appbar.Content title="Expense Detail" titleStyle={{color: 'black'}} />
        <Appbar.Action icon="refresh" onPress={editandDone} />
      </Appbar.Header>
      {/* <BottomSheet
        ref={bs}
        initialSnap={2}
        snapPoints={[550, 300, 0]}
        borderRadius={10}
        renderContent={renderInner}
        renderHeader={renderHeader}
        callbackNode={fall}
      /> */}
      {/* <TextInput
        style={styles.textInputshid}
        //   style={styles.inputs}
        value={user}
        onChangeText={value => setuser(value)}
      /> */}

      <ScrollView style={styles.container}>
        {/* <TouchableRipple onPress={closemodal}> */}
        <View style={{borderColor: 'black', borderWidth: 1, marginTop: 20}}>
          {images !== '' ? (
            <SliderBox
              images={images}
              sliderBoxHeight={400}
              //onCurrentImagePressed={console.log(`image pressed '${images}'`)}
              onCurrentImagePressed={index =>
                console.log(`image ${index} pressed`)
              }
              currentImageEmitter={index => setImageIndex(index)}
              dotColor="#FFEE58"
              inactiveDotColor="#90A4AE"
              resizeMethod={'resize'}
              resizeMode={'cover'}
              ImageComponentStyle={{width: '100%'}}
            />
          ) : (
            <ActivityIndicator size="small" color="#0000ff" />
          )}
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <View>
            {isEditable && isSubmitted ? (
              <TouchableOpacity onPress={() => setRNModalVisible(true)}>
                <Icon name="image-plus" size={42} style={styles.Icons} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity disabled onPress={() => bs.current.snapTo(0)}>
                <Icon name="image-plus" size={42} style={styles.Icons} />
              </TouchableOpacity>
            )}
          </View>
          <View>
            {isEditable && isSubmitted ? (
              <TouchableOpacity onPress={deletepre}>
                <Icon name="image-remove" size={40} style={styles.Icons} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity disabled onPress={() => bs.current.snapTo(0)}>
                <Icon name="image-remove" size={40} style={styles.Icons} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View>
          {isEditable && isSubmitted ? (
            <TextInput
              style={styles.textInputs}
              label="Description"
              //   style={styles.inputs}
              placeholder="Lunch with Customer"
              value={Description}
              theme={{
                colors: {
                  text: 'black',
                  accent: '#ffffff',
                  primary: 'black',
                  placeholder: 'black',
                  //background: 'transparent',
                },
              }}
              underlineColor="black"
              onChangeText={value => setDescription(value)}
            />
          ) : (
            <Title
              style={[
                styles.title,
                {marginTop: 15, marginBottom: 5, alignSelf: 'center'},
              ]}>
              {Description}
            </Title>
          )}
          {/* {isEditable ? (
            <Picker
              style={styles.picker}
              mode="dropdown"
              selectedValue={products}
              onValueChange={(itemValue, itemIndex) =>
                FindProductID(itemIndex)
              }>
              {pickerProduct !== '' ? (
                pickerProduct.map(pickerProduct => {
                  return (
                    <Picker.Item
                      label={pickerProduct.Products}
                      value={pickerProduct.id}
                    />
                  );
                })
              ) : (
                <Picker.Item label="Loading..." value="0" />
              )}
            </Picker>
          ) : (
            <Text style={[styles.uppertexts, {alignSelf: 'center'}]}>
              {product_face}
            </Text>
          )} */}
          <Text style={[styles.uppertexts, {alignSelf: 'center'}]}>
            {product_face}
          </Text>
          {isEditable && isSubmitted ? (
            <DatePicker
              style={{width: '90%', marginTop: 20}}
              date={Date}
              mode="date"
              placeholder="Select date"
              format="YYYY-MM-DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              androidMode="spinner"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                },
                placeholderText: {
                  color: '#000000',
                },
              }}
              onDateChange={date => setDate(date)}
            />
          ) : (
            <Text style={[styles.uppertexts, {alignSelf: 'center'}]}>
              {Date}
            </Text>
          )}
          {isEditable && isSubmitted ? (
            <Picker
              style={styles.pickerCurrency}
              mode="dropdown"
              selectedValue={Currency}
              onValueChange={setCurrency}>
              {CurrencyPicker !== '' ? (
                CurrencyPicker.map(currency => {
                  return (
                    <Picker.Item
                      label={currency.Currency}
                      value={currency.id}
                    />
                  );
                })
              ) : (
                <Picker.Item label="Loading..." value="0" />
              )}
            </Picker>
          ) : (
            <Text style={[styles.TextI, {alignSelf: 'center'}]}>
              {Currency}
            </Text>
          )}
          <View
            style={{
              marginHorizontal: 10,
            }}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Title>Unit Price:</Title>
              {isEditable && isSubmitted ? (
                <TextInput
                  style={styles.inputs}
                  placeholder="100"
                  value={unitPrice}
                  theme={{
                    colors: {
                      text: 'black',
                      accent: '#ffffff',
                      primary: 'black',
                      placeholder: 'grey',
                      background: 'transparent',
                    },
                  }}
                  underlineColor="black"
                  onChangeText={value => setUnitPrice(value)}
                />
              ) : (
                <Text style={styles.TextI}>{unitPrice}</Text>
              )}
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Title>Quantity:</Title>
              {isEditable && isSubmitted ? (
                <TextInput
                  style={styles.inputs}
                  placeholder="1"
                  value={Quantity}
                  theme={{
                    colors: {
                      text: 'black',
                      accent: '#ffffff',
                      primary: 'black',
                      placeholder: 'gray',
                      background: 'transparent',
                    },
                  }}
                  underlineColor="black"
                  onChangeText={value => setQuantity(value)}
                />
              ) : (
                <Text style={styles.TextI}>{Quantity}</Text>
              )}
            </View>
          </View>

          {/* <Text style={styles.texts}>Taxes: </Text>
          <Picker
            mode="dropdown"
            prompt="Taxes"
            style={styles.picker}
            selectedValue={Taxes}
            onValueChange={itemValue => setTaxes(itemValue)}>
            <Picker.Item label="5%" value={5} />
            <Picker.Item label="10%" value={10} />
            <Picker.Item label="15%" value={15} />
          </Picker> */}
          <View style={{marginHorizontal: 10}}>
            {isEditable && isSubmitted ? (
              <Picker
                style={styles.picker}
                mode="dropdown"
                selectedValue={paidBy}
                onValueChange={value => paidbye(value)}>
                <Picker.Item
                  color="#000000"
                  style={{backgroundColor: '#FFFFFF'}}
                  label="Paid By Company"
                  value="company_account"
                />
                <Picker.Item
                  color="#000000"
                  style={{backgroundColor: '#FFFFFF'}}
                  label="Paid By Employee"
                  value="own_account"
                />
              </Picker>
            ) : (
              <Text style={[styles.TextI, {alignSelf: 'center'}]}>
                {paidByFace}
              </Text>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 10,
              justifyContent: 'space-between',
            }}>
            <Title>Status: </Title>
            <Title>{Status}</Title>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 10,
              justifyContent: 'space-between',
            }}>
            <Title>Total: </Title>
            <Title>{Total}</Title>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {isEditable && isSubmitted ? (
              <Button onPress={save}>Save</Button>
            ) : (
              <Button onPress={edit}>Edit</Button>
            )}
            <Button style={styles.button} onPress={handleinputs}>
              Submit
            </Button>
          </View>
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
        {/* </TouchableRipple> */}
      </ScrollView>
    </>
  );
};
export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 2,
    backgroundColor: '#FFFFFF',
  },
  textInputs: {
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 18,
  },
  texts: {
    marginTop: 10,
    fontSize: 20,
  },
  button: {
    marginVertical: 10,
  },
  picker: {
    marginVertical: 10,
    //backgroundColor: 'red',
    //color: 'red',
    transform: [{scaleY: 1.3}],
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
    width: '60%',
  },
  pickerCurrency: {
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    transform: [{scaleY: 1.2}],
    width: '40%',
    left: 20,
  },
  uppertexts: {
    fontSize: 18,
    marginHorizontal: 8,
    fontWeight: '500',
    marginVertical: 10,
  },
  TextI: {
    fontSize: 20,
    marginVertical: 7,
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
});
