import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Image, Alert} from 'react-native';
import {TextInput, Card, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import ExpenseList from './ExpenseList';
import {
  material,
  human,
  robotoWeights,
  materialColors,
  materialDense,
} from 'react-native-typography';
import * as Animatable from 'react-native-animatable';
import NetInfo from '@react-native-community/netinfo';
import {jwt} from 'react-native-pure-jwt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {db} from '../Database';

const StageScreen = () => {
  const [membershipId, setMembershipId] = useState('MEM00159');
  const [url, setUrl] = useState(
    'https://demo.o2btechnologies.com/o2b/omini/users',
  );
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [expense_rights, setExpense_rights] = useState([]);
  const [uid, setUid] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Customer_Table'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            //txn.executeSql('DROP TABLE IF EXISTS Customer_Table', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS Customer_Table(Customer_id INTEGER PRIMARY KEY AUTOINCREMENT, Customer_email VARCHAR(30), Customer_password VARCHAR(30), Expense_rights VARCHAR(30), uId INTEGER UNIQUE, Token VARCHAR(30))',
              [],
            );
          }
        },
      );
    });
  }, []);

  const data = [];

  const handleLogin = () => {
    const url = 'https://demo.o2btechnologies.com/o2b/omini/users';
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        params: {
          membership_id: 'MEM00159',
          user: {
            login: 'admin',
            password: 'doctor123',
          },
        },
      }),
    })
      .then(res => res.json())
      .then(async data => {
        //setdata(data.result);

        const myObj = data.result;

        const toJSON = JSON.parse(myObj);
        console.log(toJSON);
        const toLOG = toJSON.users;
        console.log('hello56675', toLOG[0].login);
        // console.log(toLOG[1].expense_rights);
        insertData(toLOG);
      })
      .catch(e => {
        //setIsLoading(false);
        alert('Kindly enter the correct credentials !');
      });
  };

  const insertData = toLOG => {
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
              addtoken();
              Alert.alert('Data Inserted Successfully....');
            } else Alert.alert('Failed....');
          },
        );
      });
    }
    viewCustomer();
  };

  const addtoken = () => {
    const token = jwt.sign(
      {
        iss: 'luisfelipez@live.com',
        exp: new Date().getTime() + 3600 * 1000, // expiration date, required, in ms, absolute to 1/1/1970
        additional: 'payload',
      }, // body
      'my-secret', // secret
      {
        alg: 'HS256',
      },
    );
    storeData(token);
  };

  console.log(data);

  const viewCustomer = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Customer_Table', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        console.log(temp);
      });
    });
  };

  const storeData = async value => {
    console.log('in the storedata!');
    try {
      await AsyncStorage.setItem('Key', value1.toString());
      console.log('key:', value);
    } catch (e) {
      // saving error
    }
  };

  //   const searchUser = () => {
  //     // const em = 'rikiaryan5@gmail.com';
  //     // console.log(inputemail);
  //     db.transaction(tx => {
  //       tx.executeSql(
  //         `SELECT * from Customer_table where Customer_email = '${inputemail}' and Customer_password = '${inputPassword}'`,
  //         [],

  //         async (tx, results) => {
  //           var len = results.rows.length;
  //           console.log('len:', len);
  //           if (len > 0) {
  //             navigation.navigate('ExpenseList');
  //           } else {
  //             Alert.alert('No User Found');
  //           }
  //         },
  //       );
  //     });
  //   };

  // fetch('https://demo.o2btechnologies.com/o2b/omini/users', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     params: {
  //       membership_id: 'MEM00159',
  //       user: {
  //         login: 'admin',
  //         password: 'doctor123',
  //       },
  //     },
  //   }),
  // });

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
              value={membershipId}
              underlineColor="#00ACC1"
              label="Membership-Id"
              onChangeText={data => setMembershipId(data)}
            />
            <TextInput
              value={url}
              style={{marginVertical: 10}}
              underlineColor="#00ACC1"
              label="Url"
              onChangeText={data => setUrl(data)}
            />
          </Card.Content>
          <Card.Actions
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-end',
              marginRight: 10,
            }}>
            {/* <Button compact={false} mode="contained" onPress={searchUser}>
              save
            </Button> */}
          </Card.Actions>
        </Card>
        <Button compact={false} mode="contained" onPress={() => handleLogin()}>
          save
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A5D6A7',
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
  cards: {},
});

export default StageScreen;
