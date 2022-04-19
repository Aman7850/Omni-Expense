import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {TextInput, Card, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {NavigationContainer, useNavigation} from '@react-navigation/native';

import * as Animatable from 'react-native-animatable';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {jwt} from 'react-native-pure-jwt';

import {db} from '../Database';
import {sha512} from 'react-native-sha512';
import {useNetInfo} from '@react-native-community/netinfo';

const LoginScreen = () => {
  const [inputemail, setInputemail] = useState('');
  const [inputPassword, setInputpassword] = useState('');
  const [membershipId, setMembershipId] = useState('');
  const [url, setUrl] = useState('');
  const [uid, setUid] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [visible, setvisible] = useState(false);

  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Customer_Table'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (!res.rows.length) {
           
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS Customer_Table(Customer_id INTEGER PRIMARY KEY AUTOINCREMENT, Customer_email VARCHAR(30), Customer_password VARCHAR(30), Expense_rights VARCHAR(30), uId INTEGER UNIQUE, Token VARCHAR(30))',
              [],
            );
          }
        },
      );
    });
  }, []);

  useEffect(() => {
    return new Promise((resolve, reject) => {
      db.transaction(function (txn) {
        txn.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='Omni_Expense'",
          [],
          function (tx, res) {
            resolve(res);
            console.log('item:', res.rows.length);
            if (!res.rows.length) {
              console.log('table about to be created');
             
              tx.executeSql(
                'CREATE TABLE IF NOT EXISTS Omni_Expense(Customer_id INTEGER PRIMARY KEY AUTOINCREMENT, Description VARCHAR(30), Products VARCHAR(30), unitPrice REAL, Quantity INTEGER, taxes REAL, Total REAL, PaidBy VARCHAR(30), Photo_id INTEGER, CreatedDate DATE, Status VARCHAR, img BLOB, CurrencySymbol VARCHAR,ExpenseId VARCHAR, ExpenseReference VARCHAR, uId VARCHAR, submittedBy VARCHAR)',
                console.log('table created OMNIEXPENSE'),
                [],
              );
            }
          },
        );
      });
    });
  }, []);

  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Omni_Products'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (!res.rows.length) {
           
            tx.executeSql(
              'CREATE TABLE IF NOT EXISTS Omni_Expense_Image(id INTEGER PRIMARY KEY AUTOINCREMENT,Expense_Images Blob,Parent_id INTEGER)',
              console.log('table created', 'OMNIEXPENSE IMAGE'),
              [],
            );
          }
        },
      );
    });
    console.log('Omni product table created');
  }, []);

  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Omni_Products'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (!res.rows.length) {
            
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS Omni_Products(id INTEGER PRIMARY KEY,Products VARCHAR(30))',
              [],
            );
          }
        },
      );
    });
    console.log('Omni product table created');
  }, []);

  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Omni_Currency'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (!res.rows.length) {
            
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS Omni_Currency(id INTEGER PRIMARY KEY,Currency VARCHAR(30))',
              [],
            );
          }
        },
      );
    });
    console.log('Omni currrency table created');
  }, []);

  const searchuser = async () => {
    
    setvisible(true);
    const urls = 'https://www.o2btechnologies.com/o2b/check_membership/login';
    const response = await fetch(urls, {
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
            login: inputemail,
            password: inputPassword,
          },
        },
      }),
    });
    const json12 = await response.json();
    
    console.log(typeof json12.result, 'CHECKING INVALID PASSWORD');
    console.log(json12.result, 'CHECKING INVALID PASSWORD');
    
    if (json12.result.hasOwnProperty('error')) {
      console.log(json12.result.error);
      Alert.alert(json12.result.error);
      setIsLogin(false);
      return 0;
    }
    console.log(json12.result.base_domain, 'getting all data!');
    const domain = json12.result.base_domain;
    setUrl(domain);
    console.log('the url:', domain);
    console.log('the url:', url);
    const toLOG = json12.result.users;
    console.log('we have the hulk!', toLOG);
    const id = toLOG[0].login;
    const pass = toLOG[0].password;
    setUid(toLOG[0].uid.toString());
    storeMembership(toLOG[0].uid.toString());
    console.log(uid, 'checking inside controllerrrr');
    console.log(typeof uid, 'checking inside controllerrrr');

    
    console.log('getting into insert data!');
    for (let i = 0; i < toLOG.length; i++) {
      db.transaction(function (tx) {
        console.log('inserting data into sqlite!');
        tx.executeSql(
          `INSERT OR REPLACE INTO Customer_Table (Customer_email, Customer_password, Expense_rights, uId, Token) VALUES ('${toLOG[i].login}','${toLOG[i].password}','${toLOG[i].expense_rights}','${toLOG[i].uid}','${toLOG[i].password}')`,
          console.log('inserted!'),
          async (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              
            } else Alert.alert('Failed....');
          },
        );
      });
    }
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM Customer_Table where Customer_email='${inputemail}'`,
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          console.log('defcon 4', temp);
          storeExpenseRights(temp[0].Expense_rights);
        },
      );
    });
    storeData(domain, id, pass);
    handleProducts(domain);
    handleCurrency(domain);
    setvisible(false);
    navigation.navigate('ExpenseList');
    setIsLogin(false);
    setUid('');
    setInputemail('');
    setInputpassword('');
    setMembershipId('');
    
  };

  const searchUserEmail = () => {
    
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * from Customer_table where Customer_email = '${inputemail}' and Token is NOT NULL `,
        
        [],
        (tx, results) => {
          var len = results.rows.length;
          console.log('len:', len);
          if (len > 0) {
           
            console.log(len, 'helo');
          } else {
            Alert.alert('Invalid Credentials');
          }
        },
      );
    });
  };

  const storeData = async (url, email, pass) => {
    console.log('in the storedataurlemialpassss!');
    try {
      await AsyncStorage.setItem('Url', url);
      console.log('Urllalal', typeof url);
      console.log('Urllalal', url);

      await AsyncStorage.setItem('email', email);
      console.log('Urllalal', typeof email);
      console.log('Urllalal', email);

      await AsyncStorage.setItem('password', pass);
      console.log('Urllalal', typeof pass);
      console.log('Urllalal', pass);
    } catch (e) {
     
    }
    storeMembership();
  };

  const Logging = () => {
    setIsLogin(true);
    searchuser();
  };

  const storeMembership = async uiid => {
    const mem = membershipId;
    console.log(uiid, 'in the storedatamemberSHIP!');
    try {
      await AsyncStorage.setItem('Membership', mem);
      await AsyncStorage.setItem('uID', uiid);
    } catch (e) {
      
    }
  };

  const getData = async () => {
    try {
      const ur = await AsyncStorage.getItem('Url');
      const em = await AsyncStorage.getItem('email');
      const pas = await AsyncStorage.getItem('password');
      
      if (ur !== null && em !== null && pas !== null) {
        navigation.navigate('ExpenseList');
      }
    } catch (e) {
      
    }
  };

  const handleProducts = async domain => {
    console.log(domain, 'inside handleProducts');
   
    const response45 = await fetch(domain + '/o2b/omini/products', {
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
    });
    const json1256 = await response45.json();
    
    const myObj = json1256.result;

    const toJSON = JSON.parse(myObj);
    const toLOG = toJSON.products;
    console.log(toLOG, 'checking prod from controller!');
    
    insertProducts(toLOG);
   
  };

  const insertProducts = toLOG => {
    console.log('data about to be inserted');
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
          console.log(temp, 'checking prod and id in the database!');
         
        },
      );
    });
  };

  const handleCurrency = async domain => {
    console.log(domain, 'inside handleCurrency');
   
    const response456 = await fetch(domain + '/o2b/omini/currency', {
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
            login: inputemail,
            password: inputPassword,
          },
        },
      }),
    });
    const json1111 = await response456.json();
    
    console.log(json1111.result);
    const myObj = json1111.result;
    console.log(myObj);
    console.log(typeof myObj);
    const toJSON = JSON.parse(myObj);
    console.log(typeof toJSON);
    console.log(toJSON.currencies);
    const toLOG = toJSON.currencies;
    insertCurrencies(toLOG);
    
    console.log(toLOG, 'jefnklhfuefiuoefsfee68e78e977tfye');
    
  };
  const insertCurrencies = toLOG => {
    console.log(toLOG, 'data about to be inserted');
    for (let i = 0; i < toLOG.length; i++) {
      db.transaction(function (tx) {
        tx.executeSql(
          `INSERT INTO Omni_Currency(Currency,id) VALUES('${toLOG[i].name}','${toLOG[i].id}')`,
          (tx, results) => {
            console.log('Results', results.rowsAffected);

            if (results.rowsAffected > 0) {
              console.log('Data Inserted Successfully....');
            } else console.log('Failed');
          },
        );
      });
    }
    
  };

  const navigation = useNavigation();

  

  const insertData = toLOG => {};
  const storeExpenseRights = ExpenseRights => {
    
    console.log('in the storedata!');
    try {
      AsyncStorage.setItem('ExpenseRights', ExpenseRights);
      console.log('Urllalal', typeof ExpenseRights);
      console.log('Urllalal', ExpenseRights);
    } catch (e) {
      console.log(e);
      
    }
  };

  const viewCustomer = () => {};

  getData();
  

  return (
    <View style={styles.container}>
      <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
        <Animatable.Text
          style={styles.baseText}
          animation="fadeInUp"
          delay={1200}>
          OMNI EXPENSE
        </Animatable.Text>
      </View>
      <View style={{flex: 4}}>
        <Card style={styles.cards} elevation={4}>
          <Card.Content>
            <TextInput
              value={inputemail}
              style={{marginVertical: 10, backgroundColor: '#FFFFFF'}}
              underlineColor="#00ACC1"
              label="Email"
              placeholder="info@o2btechnologies.com"
              onChangeText={email => setInputemail(email)}
            />
            <TextInput
              value={inputPassword}
              style={{marginVertical: 10, backgroundColor: '#FFFFFF'}}
              underlineColor="#00ACC1"
              label="Password"
              placeholder="*************"
              secureTextEntry
              onChangeText={password => setInputpassword(password)}
            />
            <TextInput
              value={membershipId}
              style={{marginVertical: 10, backgroundColor: '#FFFFFF'}}
              underlineColor="#00ACC1"
              label="Membership-Id"
              onChangeText={data => setMembershipId(data)}
            />
          </Card.Content>
          <Card.Actions
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-end',
              marginRight: 10,
              alignSelf: 'center',
            }}>
            {isLogin ? (
              <ActivityIndicator color="red" size="large" animating={visible} />
            ) : (
              <Button compact={false} mode="contained" onPress={Logging}>
                Login
              </Button>
            )}
          </Card.Actions>
        </Card>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'center',
  },
  icons: {
    color: '#7E57C2',
  },
  baseText: {
    fontSize: 30,
    color: '#4DB6AC',
  },
  cards: {
    backgroundColor: '#FFFFFF',
  },
});

export default LoginScreen;
