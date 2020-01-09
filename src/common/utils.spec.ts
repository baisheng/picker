/**
 * 工具类测试
 */

import { Test, TestingModule } from '@nestjs/testing';
import * as utils from './utils';
import * as _ from 'lodash';
import crypto from 'crypto';
import { sha } from './utils';
import { DeepPartial } from '@app/common/shared-types';

export class DeviceDTO {
  // constructor(input?: DeepPartial<DeviceDTO>) {
  //   super(input);
  // }
  constructor(props) {
    // super(props);
  }

  model: string;
  version: string;
  plat: string;
}

describe('utils', () => {
  let app: TestingModule;

  // beforeAll(async () => {
  //  app = await Test.createTestingModule({
  //   controllers: [AppController],
  //  }).compile();
  // });

  // describe('root', () => {
  //  it('should return "object"', () => {
  //   const appController = app.get<AppController>(AppController);
  //   expect(typeof appController.root()).toBe('object');
  //  });
  // });
  describe('sha265', () => {
    it('编码', () => {
      const appId: string = 'APP7C215A212F7F46BEAB75001C364AB56D';
      const appKey: string = '993615CB5D524233B5E6C8EC17093AA6';
//    private String comparison_api = "https://biap-is-stg.pa18.com:10030/biap/face/v1/comparison";
      const comparisonApi = 'https://biap-is-stg.pingan.com.cn/biap/face/v1/comparison';
      // utils.hMacSHA265()
      // expect();
      // const httpMethod = 'POST';
      // const apiMethod = '/biap/face/v1/comparison';
      // let signData = httpMethod + '\n';
      const headers = {
        'content-type': 'application/json;charset=utf-8',
        'x-appid': appId,
        'x-deviceid': 'test_client',
        // 'x-timestamp': new Date().getTime().toString(),
      };
      const bodyContent = {
        person_name: '刘佰晟',
        request_id: '1002',
        device: { model: 'MBP 2017', version: '10.3.3', plat: '3' },
        person_id: '23023019860111001X',
      };

      console.log(bodyContent);
      const bodyHash = utils.sha(JSON.stringify(bodyContent));
      console.log('BODY HASH --- ');
      console.log(bodyHash);
      // for (const header of headers) {
      //   console.log(header);
      // }
      // let sHeaders = '';
      // _.forIn(headers, (value, key) => {
      //   signData = signData + key + ':' + value + '\n';
      //   if (sHeaders === '') {
      //     sHeaders = key;
      //   } else {
      //     sHeaders = sHeaders + ';' + key;
      //   }
      // });
      // signData = signData + sHeaders + '\n' ;
      // console.log(signData);
      // const shaDATA = utils.sha(signData);
      // console.log(shaDATA);
    });
  });
});
