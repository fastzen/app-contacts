import {inject} from 'aurelia-framework';

let latency = 0;
let id = 0;

function getId(){
  return ++id;
}

let contacts = [
  {
    id:getId(),
    _id:`${id}`,
    firstName:'John',
    lastName:'Tolkien',
    email:'tolkien@inklings.com',
    phoneNumber:'867-5309'
  },
  {
    id:getId(),
    _id:`${id}`,
    firstName:'Clive',
    lastName:'Lewis',
    email:'lewis@inklings.com',
    phoneNumber:'867-5309'
  },
  {
    id:getId(),
    _id:`${id}`,
    firstName:'Owen',
    lastName:'Barfield',
    email:'barfield@inklings.com',
    phoneNumber:'867-5309'
  },
  {
    id:getId(),
    _id:`${id}`,
    firstName:'Charles',
    lastName:'Williams',
    email:'williams@inklings.com',
    phoneNumber:'867-5309'
  },
  {
    id:getId(),
    _id:`${id}`,
    firstName:'Roger',
    lastName:'Green',
    email:'green@inklings.com',
    phoneNumber:'867-5309'
  }
];

@inject('db')
export class PouchAPI {

  constructor(db){
    this.db = db;
    this.db.bulkDocs(contacts).then(function (result) {
      console.log(result);
      console.info('Document update conflicts probably mean that the data is already stored in PouchDB');
    }).catch(function (error) {
      console.log(error);
    });
  }

  getContactList(){
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        this.db.allDocs({ include_docs: true }).then(function (result) {
          var results = result.rows.map(function (row) { return row.doc; });
          resolve(results);
        }).catch(function (err) {
          reject(err);
        });
        this.isRequesting = false;
      }, latency);
    });
  }

  getContactDetails(id){
    this.isRequesting = true;
    return new Promise( (resolve, reject) => {
      setTimeout(() => {
        this.db.get(id).then(function (doc) {
          resolve(JSON.parse(JSON.stringify(doc)));
        }).catch(function (err) {
          reject(err);
        });
        this.isRequesting = false;
      }, latency);
    });
  }

  saveContact(contact){
    this.isRequesting = true;
    return new Promise( (resolve, reject) => {
      setTimeout(() => {
        let instance = JSON.parse(JSON.stringify(contact));
        this.db.get(contact._id).then( (found) => {
          return this.db.put(instance).then(function(response){
            resolve(instance);
          }).catch(function (err){
            reject(err);
          });
        }).catch(function (err) {
          instance.id = getId();
          return this.db.put(instance).then(function(response){
            resolve(instance);
          }).catch(function (err){
            reject(err);
          });
        });
        this.isRequesting = false;
        resolve(instance);
      }, latency);
    });
  }
}
