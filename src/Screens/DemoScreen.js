import {StylesContext} from '@material-ui/styles';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {TextInput, Title, Button, Divider} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
//import DatePicker from 'react-native-datepicker';
//import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {db} from '../Database';
import {inputemail} from './LoginScreen';
import {useNetInfo} from '@react-native-community/netinfo';
import {Appbar} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Card} from 'native-base';
//import DateTimePicker from '@react-native-community/datetimepicker';

function FormScreen({route, navigation}) {
  //console.log(inputemail);
  const [user, setuser] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState('');
  const [unitprice, setUnitprice] = useState('');
  const [Quantity, setQuantity] = useState('');
  const [Taxes, setTaxes] = useState('');
  //const [Total, setTotal] = useState();
  const [PaidBy, SetPaidBy] = useState('');
  const [date, setdate] = useState(
    '0' +
      (new Date().getMonth() + 1) +
      '/' +
      '0' +
      new Date().getDate() +
      '/' +
      new Date().getFullYear(),
  );
  const [product_id, setProduct_id] = useState('7');
  const [pickerProduct, setPickerProduct] = useState([]);
  const [status, setStatus] = useState('draft');
  const [membership, setMembership] = useState('');
  const [CurrencyPicker, setCurrencyPicker] = useState([]);
  const [Currency, setCurrency] = useState('');
  const [record_id, setrecord_id] = useState(0);
  const [ExpenseReference, setExpenseReference] = useState('');
  const [visible, setvisible] = useState(false);
  const [isSave, setIsSave] = useState(false);
  //const [date, setDate] = useState(new Date(1598051730000));
  // const [mode, setMode] = useState('date');
  // const [show, setShow] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [ExpenseRights, setExpenseRights] = useState('');
  const [uid, setUid] = useState('');
  const [Asyncurl, setAsyncurl] = useState('');
  const [Loading, setLoading] = useState(false);
  const [spinLoaderTwo, setSpinLoaderTwo] = useState(false);
  const [inputValue, setInputValue] = useState(false);

  //console.log(date, 'checkig');

  useEffect(() => {
    getData();
    setSpinLoaderTwo(true);
    db.transaction(tx => {
      tx.executeSql(
        'SELECT id,Products FROM Omni_Products',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          //console.log(temp);
          setPickerProduct(temp);
        },
      );
      tx.executeSql(
        'SELECT id,Currency FROM Omni_Currency',
        [],
        (tx, results) => {
          var temp1 = [];
          for (let j = 0; j < results.rows.length; ++j)
            temp1.push(results.rows.item(j));
          //console.log(temp1, 'Currencies in database!');
          setCurrencyPicker(temp1);
          setSpinLoaderTwo(false);
          //console.log(CurrencyPicker, 'checking key prop');
        },
      );
    });
  }, [ExpenseRights]);

  const showvisible = () => setvisible(true);
  const hideDialog = () => setvisible(false);

  const random = () => {
    Math.floor(Math.random() * 10 + 1);
  };
  const netInfo = useNetInfo();

  const {tempora} = route.params;
  console.log(tempora, 'image id');

  const saveing = () => {
    //setInputValue(true);
    setIsSave(true);
    insertData();
  };

  // useEffect(() => {
  //   //console.log('dormamu ! i have come to bargain!');
  // });

  const getData = async () => {
    try {
      //const ur = await AsyncStorage.getItem('Url');
      const em = await AsyncStorage.getItem('email');
      //const pas = await AsyncStorage.getItem('password');
      //const mem = await AsyncStorage.getItem('Membership');
      const Exp_Right = await AsyncStorage.getItem('ExpenseRights');
      const u_id = await AsyncStorage.getItem('uID');

      // console.log('membershipid email and password on Form screen!');
      // console.log(em, 'email');
      // console.log(Exp_Right, '...............');
      setuser(em);
      //setMembership(mem);
      setExpenseRights(Exp_Right);
      setUid(u_id);
      // setPassword(pas);
      // setAsyncurl(ur);
      if (Exp_Right == 'Manager') {
        SetPaidBy('company_account');
      }
      if (Exp_Right == null) {
        SetPaidBy('own_account');
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  const changeColorTitle = () => {
    if (inputValue == false) {
      return '#424242';
    } else {
      if (description == '') {
        return 'red';
      } else {
        return '#424242';
      }
    }
  };

  const t = unitprice * Quantity;
  const Total = (t * Taxes) / 100 + t;

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    const g = JSON.stringify(date);
    const g_array = g.slice(1, 11).split('-').reverse().join('/');
    console.log('A date has been picked: ', g_array);
    console.log('A date has been picked: ', typeof g);
    setdate(g_array);
    hideDatePicker();
  };

  // const {source} = route.params;
  const {showimage} = route.params;

  const insertData = () => {
    {
      setvisible(true);
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO Omni_Expense(Description,Products,unitPrice,Quantity,taxes,Total,PaidBy, Photo_id, CreatedDate, Status,CurrencySymbol,ExpenseReference, uId) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [
            description,
            products,
            unitprice,
            Quantity,
            Taxes,
            Total,
            PaidBy,
            tempora,
            date,
            status,
            Currency,
            ExpenseReference,
            uid,
          ],
          (tx, results) => {
            //navigation.navigate('ExpenseList');
            console.log('Results', results.rowsAffected);
          },
        );
      });

      db.transaction(tx => {
        console.log(tempora, 'temporar inside multidb func!');
        tx.executeSql(
          `SELECT Customer_id FROM Omni_Expense where Photo_id='${tempora}'`,
          [],
          (tx, results) => {
            var temp = [];
            var j = 0;
            for (let i = 0; i < results.rows.length; ++i) {
              j = i;
              temp.push(results.rows.item(i));
            }
            navigation.navigate('ExpenseList');
            //temp.push(results.rows.item(results.rows.length));
            console.log(temp[j].Customer_id, 'CUSTOMER ID HERE!    ONE');
            //setrecord_id(temp[j].Customer_id);
            // const cus_id = temp[0].Customer_id;
            // console.log(record_id, 'CUSTOMER ID HERE!   TWO');
            tx.executeSql(
              `UPDATE Omni_Expense_Image SET Parent_id='${temp[j].Customer_id}' where id='${tempora}'`,
              [],
              (tx, results) => {
                console.log(results.rows.length, 'FOCUS!');
                setInputValue(false);
                setvisible(false);
                //navigation.navigate('ExpenseList');
                // var temp = [];
                // var j = 0;
                // for (let i = 0; i < results.rows.length; ++i) {
                //   j = i;
                //   temp.push(results.rows.item(i));
                // }

                //temp.push(results.rows.item(results.rows.length));
                console.log(temp, 'CUSTOMER ID HERE! AND I AM OUT!');
                // const cus_id = temp[0].Customer_id;
                // console.log(cus_id, 'CUSTOMER ID HERE!');
              },
            );
          },
        );
      });
    }
  };

  const viewCustomers = () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT Customer_id FROM Omni_Expense where Photo_id='${tempora}'`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          console.log(temp);
        },
      );
    });
  };
  const viewProducts = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT id,Products FROM Omni_Products',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          //console.log(temp);
          setPickerProduct(temp);
        },
      );
    });
    viewCurrency();
  };

  const viewCurrency = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT id,Currency FROM Omni_Currency',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          console.log(temp, 'Currencies in database!');
          setCurrencyPicker(temp);
          //console.log(CurrencyPicker, 'checking key prop');
        },
      );
    });
  };

  const Upricenum = val => {
    console.log(typeof val);
    setUnitprice(val);
    // if (typeof val !== 'number') {
    //   console.log('Enter Only Number');
    //   setUnitprice(val);
    // } else {
    //   console.log('Success');
    // }
  };

  //console.log('this is it!', typeof pickerProduct[0].id);
  // console.log('pickerProduct type', typeof pickerProduct);
  // const serviceItems = () => {
  //   for (var i in pickerProduct) {
  //     return <Picker.Item value={i} label={i} />;
  //   }
  // };
  // const pick = Array.from(pickerProduct);
  // console.log('pick', pick);

  // console.log('type of pick', typeof pick);

  // const serviceItems = pickerProduct.map((Products, id) => {
  //   return <Picker.Item key={id} value={id} label={Products} />;
  // });

  // const serviceItems = () => {
  //   for (let i = 0; i < pickerProduct.length; ++i) {
  //     <Picker.Item
  //       value={pickerProduct[i].id}
  //       label={pickerProduct[i].Products}
  //     />;
  //   }
  // };
  const refreshsome = () => {
    // handleProducts();
    // handleCurrency();
  };

  return (
    <>
      <Appbar.Header
        style={{alignContent: 'center', backgroundColor: '#3D5AFE'}}>
        <Appbar.BackAction onPress={() => navigation.navigate('ExpenseList')} />
        <Appbar.Content title="Expense Form" titleStyle={{color: 'white'}} />
        {/* <Appbar.Action icon="refresh" onPress={refreshsome} /> */}
      </Appbar.Header>
      <TextInput
        style={styles.textInputshid}
        //   style={styles.inputs}
        value={user}
        onChangeText={value => setuser(value)}
      />
      <ScrollView style={styles.container}>
        <Card
          style={{
            marginTop: 20,
            marginBottom: 5,
            marginLeft: 10,
            marginRight: 10,
            borderRadius: 20,
            height: 450,
          }}>
          <Image
            source={{uri: showimage}}
            style={{
              alignSelf: 'center',
              height: '93%',
              width: '90%',
              marginVertical: 15,
            }}></Image>
        </Card>
        <Card
          style={{
            padding: 20,
            marginTop: 5,
            marginBottom: 5,
            marginLeft: 10,
            marginRight: 10,
            borderRadius: 20,
            width: '95%',
            height: 500,
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
              <TouchableOpacity>
                <Picker
                  style={styles.picker}
                  mode="dropdown"
                  selectedValue={products}
                  onValueChange={setProducts}>
                  <Picker.Item
                    color="#000000"
                    style={{backgroundColor: '#FFFFFF'}}
                    label="--Select Products--"
                  />
                  {pickerProduct !== '' ? (
                    pickerProduct.map(pickerProduct => {
                      return (
                        <Picker.Item
                          color="#000000"
                          style={{backgroundColor: '#FFFFFF'}}
                          key={pickerProduct.id}
                          label={pickerProduct.Products}
                          value={pickerProduct.id}
                        />
                      );
                    })
                  ) : (
                    <Picker.Item label="Loading..." value="0" />
                  )}
                </Picker>
              </TouchableOpacity>

              <View
                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <TextInput
                  style={styles.textInputs}
                  keyboardType="numeric"
                  value={Quantity}
                  label="Quantity"
                  mode="outlined"
                  maxLength={6}
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
                  onChangeText={value => setQuantity(value)}
                />

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
                          key={currency.id}
                          value={currency.id}
                        />
                      );
                    })
                  ) : (
                    <Picker.Item label="Loading..." value="0" />
                  )}
                </Picker>

                <TextInput
                  style={styles.textInputs}
                  keyboardType="numeric"
                  value={unitprice}
                  label="U.Price"
                  mode="outlined"
                  maxLength={6}
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
                  onChangeText={value => setUnitprice(value)}
                />
              </View>
              <Divider
                style={{borderColor: '#90CAF9', borderWidth: 0.5, margin: 10}}
              />
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: '#FFFFFF',
                  alignItems: 'center',
                }}>
                <Title style={{color: '#424242'}}>Paid By:</Title>
                {ExpenseRights == null ? (
                  <Picker
                    style={styles.pickerpaid}
                    mode="dropdown"
                    selectedValue={PaidBy}
                    onValueChange={itemValue => SetPaidBy(itemValue)}>
                    <Picker.Item label="Employee" value="own_account" />
                  </Picker>
                ) : (
                  <Picker
                    style={styles.pickerpaid}
                    mode="dropdown"
                    selectedValue={PaidBy}
                    onValueChange={itemValue => SetPaidBy(itemValue)}>
                    <Picker.Item label="Company" value="company_account" />
                    <Picker.Item label="Employee" value="own_account" />
                  </Picker>
                )}
              </View>
              <Divider
                style={{borderColor: '#90CAF9', borderWidth: 0.5, margin: 10}}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: '#FFFFFF',
                  alignItems: 'center',
                }}>
                <Title style={{color: '#424242'}}>Paid On:</Title>
                <View
                  style={{
                    width: '35%',
                    backgroundColor: '#90CAF9',
                    right: '50%',
                    height: '90%',
                    borderRadius: 7,
                  }}>
                  <View>
                    <TouchableOpacity onPress={showDatePicker}>
                      <Text style={{fontSize: 20, alignSelf: 'center'}}>
                        {date}
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
              </View>
              {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              justifyContent: 'space-between',
            }}>
            <TextInput
              style={styles.textInputsUnit}
              //   style={styles.inputs}
              keyboardType="numeric"
              value={unitprice}
              maxLength={10}
              theme={{
                colors: {
                  //text: 'black',
                  //accent: '#ffffff',
                  primary: 'black',
                  placeholder: 'black',
                  //background: 'transparent',
                },
              }}
              underlineColor="black"
              onChangeText={value => setUnitprice(value)}
            />
          </View> */}
              <Divider
                style={{borderColor: '#90CAF9', borderWidth: 0.5, margin: 10}}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Title style={{color: '#424242'}}>Desc:</Title>
                <TextInput
                  style={styles.textInputsDes}
                  value={description}
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
              </View>
              <Divider
                style={{borderColor: '#90CAF9', borderWidth: 0.5, margin: 10}}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Title style={{color: '#424242'}}>Reference:</Title>
                <TextInput
                  style={styles.textInputsRef}
                  value={ExpenseReference}
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
                  onChangeText={value => setExpenseReference(value)}
                />
              </View>
              <Divider
                style={{borderColor: '#90CAF9', borderWidth: 0.5, margin: 10}}
              />
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{alignContent: 'center'}}>
                  <Title style={{alignSelf: 'center', color: '#424242'}}>
                    Total:
                  </Title>
                </View>
                <View style={{alignContent: 'center'}}>
                  <Title style={{alignSelf: 'center'}}>
                    {unitprice * Quantity}
                  </Title>
                </View>
              </View>
            </>
          )}
        </Card>
        {isSave ? (
          <ActivityIndicator color="red" size="large" animating={visible} />
        ) : (
          <Button mode="contained" style={styles.button} onPress={saveing}>
            Save
          </Button>
        )}
        {/* <Button style={styles.button} onPress={saveing}>
          Submit
        </Button> */}
      </ScrollView>
    </>
  );
}

export default FormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginHorizontal: 2,
    //backgroundColor: '#FAFAFA',
    backgroundColor: '#E3F2FD',
  },
  textInputs: {
    marginVertical: 5,
    backgroundColor: '#FFFFFF',
    fontSize: 18,
    width: '35%',
  },
  textInputsDes: {
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    fontSize: 18,
    width: '70%',
    right: '15%',
    height: 40,
  },
  textInputsRef: {
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    fontSize: 18,
    width: '60%',
    right: '15%',
    height: 40,
  },
  texts: {
    marginTop: 10,
    fontSize: 20,
  },
  button: {
    marginVertical: 10,
    alignSelf: 'center',
  },
  picker: {
    width: '100%',
    backgroundColor: 'white',
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
    width: '40%',
  },
  pickerCurrency: {
    backgroundColor: '#FFFFFF',
    transform: [{scaleY: 1.2}],
    width: '30%',
    left: '60%',
  },
});
