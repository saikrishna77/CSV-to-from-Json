import React, { useEffect, useState } from 'react';
import {
  Card,
  Input,
  Button,
  Typography,
  Form,
  notification,
  Table
} from 'antd';
import { withRouter } from 'react-router-dom';
import fs from 'fs';
import { csv, local } from 'd3';
import Axios from 'axios';
const { Text } = Typography;

const AddModuleCsv = props => {
  const [formName, setFormName] = useState('');
  const [Database, setDatabase] = useState([]);
  const [fileD, setFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [formStructure, setformStructure] = useState([]);
  const [uploadFlag, setUploadFlag] = useState(false);
  const [datasource1, setDatasource1] = useState([]);
  const [columns1, setcolumns1] = useState([]);

  const submitHandler = async () => {
    setLoading(true);
    if (formName === '') {
      setLoading(false);
      return;
    } else {
      let DupformName = formName.trim();
      var regexp = /^[a-zA-Z0-9-_]+$/;
      let fileData = new FormData();
      fileData.set('file', fileD);
      console.log(fileData);
      if (regexp.test(DupformName)) {
        let DupFormStruct = formStructure.map(item => {
          return {
            name: item,
            type: 'Input_String',
            possible_values: ''
          };
        });
        console.log(DupFormStruct);
        let body = {
          Database: Database,
          formName: DupformName,
          formData: DupFormStruct,
          customCode: ''
        };
        let res = await Axios.post(api_url + 'route', body, {
          headers: {
           //headers
          },
          params: {
           //params
          }
        });
        if (!res.data.success) {
          console.log(res.data.message);
          openNotificationWithIcon(
            'error',
            `error adding ${formName} Form`,
            `error adding ${formName} Form`
          );
        } else {
          console.log(res.data.message);
          openNotificationWithIcon(
            'success',
            `Success added ${formName} Form`,
            `Successfully added ${formName}  Form`
          );
          setLoading(false);
        }
      }
    }
  };
  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
      message,
      description
    });
  };
  const onChangeHandler = async e => {
    let fileValue = e.target.files[0];
    setFile(fileValue);
    let a, database;
    var reader = new FileReader();
    reader.onload = function(e) {
      // Use reader.result
      database = [];
      a = reader.result;
      let m = a.split('\n');
      let formDup = m[0].split(',');
      m.map(item => {
        let objs = item.split(',');
        // console.log(objs[0]);
        let objstruct = {};
        for (let i = 0; i < objs.length; i++) {
          objstruct[formDup[i]] = objs[i];
        }
        database.push(objstruct);
      });
      setformStructure(formDup);
      let c = formDup.map(item => {
        return {
          title: item.toUpperCase(),
          dataIndex: item,
          key: item
        };
      });
      setcolumns1(c);
      console.log(columns1);
      database.shift();
      setDatabase(database);
      let d = database.map((item, i) => {
        let obj = item;
        obj.Key = i + 1;

        return obj;
      });

      setDatasource1(d);
      console.log(datasource1);

      setUploadFlag(true);
    };
    reader.readAsText(fileValue);
  };
  return (
    <div>
      <br></br>
      <br></br>
      <Card style={{ display: 'flex', justifyContent: 'center' }}>
        <Text
          style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: '25px',
            color: '#186AB4'
          }}
        >
          CSV Form Generator
        </Text>
        <br></br>
        <Input
          addonBefore='Form Name'
          type='text'
          id='formID'
          value={formName}
          onChange={e => setFormName(e.target.value)}
        />
        <br></br>
        <br></br>

        <Input
          onChange={e => onChangeHandler(e)}
          id='fileSelect'
          type='file'
          style={{
            border: 'hidden',
            justifyContent: 'center',
            display: 'flex'
          }}
          accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
        />

        <br></br>
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          {' '}
          <Button type='dashed' onClick={e => props.history.push()}>
            Back
          </Button>
          <Button
            loading={loading}
            type='primary'
            onClick={e => submitHandler(e)}
          >
            Create Form
          </Button>
        </div>
        <br></br>
        {uploadFlag ? (
          <Table dataSource={datasource1} columns={columns1} />
        ) : (
          ''
        )}
      </Card>
    </div>
  );
};
export default withRouter(AddModuleCsv);
