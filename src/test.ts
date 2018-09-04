import { serverless } from './sample-resources';
const IamChecker = require('./index');

const checker = new IamChecker(serverless);
checker.checkIam();
