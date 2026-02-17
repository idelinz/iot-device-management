import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../src/models/User';
import Device from '../src/models/Device';
import SensorData from '../src/models/SensorData';
import UserAction from '../src/models/UserAction';

const userId = '507f1f77bcf86cd799439011';
const otherUserId = '6993b72d2827aefb84adcebb';
const deviceId = '507f1f77bcf86cd799439022';
const otherDeviceId = '6993b7b93a7cd4b8f542803f';

const userFixture = {
  _id: userId,
  email: 'alice@example.com',
  name: 'Alice Admin',
  role: 'admin',
  settings: { notificationsEnabled: true, preferredUnits: 'metric' },
};
const otherUserFixture = {
  _id: otherUserId,
  email: 'bob@example.com',
  name: 'Bob Admin',
  role: 'admin',
  settings: { notificationsEnabled: true, preferredUnits: 'metric' },
};

const deviceFixture = {
  _id: deviceId,
  userId: userId,
  name: 'Living Room Thermostat',
  type: 'thermostat',
  deviceModel: 'Smart Home',
  serialNumber: 'THR-100',
  status: 'online',
  tags: ['living-room', 'climate'],
  summary: { firmwareVersion: '1.0.0', batteryLevel: 85, lastConnectedAt: new Date() },
};
const deviceFixtureOther = {
  userId: userId,
  name: 'CO2',
  type: 'smoke_alarm',
  deviceModel: 'Smart Home',
  serialNumber: 'SA-100',
  status: 'online',
  tags: ['kitchen', 'safety'],
  summary: { firmwareVersion: '1.0.0', batteryLevel: 85, lastConnectedAt: new Date() },
};

const deviceFixtureOtherUser = {
  _id: otherDeviceId,
  userId: otherUserId,
  name: 'CO2',
  type: 'smoke_alarm',
  deviceModel: 'Smart Home',
  serialNumber: 'SA-100',
  status: 'online',
  tags: ['kitchen', 'safety'],
  summary: { firmwareVersion: '1.0.0', batteryLevel: 85, lastConnectedAt: new Date() },
};

const sensorDataFixtures = [
  {
    sensorType: 'temperature',
    value: 21.5,
    unit: '°C',
  },
  {
    sensorType: 'temperature',
    value: 22.0,
    unit: '°C',
  },
  {
    sensorType: 'humidity',
    value: 45,
    unit: '%',
  },
];

const userActionFixtures = [
  {
    actionType: 'adjust',
    source: 'web_app',
    status: 'success',
    metadata: { previousValue: 20, newValue: 22, property: 'temperature', unit: '°C' },
  },
  {
    actionType: 'adjust',
    source: 'mobile_app',
    status: 'success',
    metadata: { previousValue: 22, newValue: 21.5, property: 'temperature', unit: '°C' },
  },
  {
    actionType: 'on',
    source: 'web_app',
    status: 'success',
  },
];

dotenv.config();

const seed = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined');
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  await Promise.all([
    User.deleteMany({}),
    Device.deleteMany({}),
    SensorData.deleteMany({}),
    UserAction.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  await User.create(userFixture);
  await User.create(otherUserFixture);
  await Device.create(deviceFixture);
  await Device.create(deviceFixtureOther);
  await Device.create(deviceFixtureOtherUser);

  const now = Date.now();
  const hour = 3600_000;
  await SensorData.insertMany(
    sensorDataFixtures.map(data => ({
      ...data,
      deviceId: deviceId,
      createdAt: new Date(now - hour * Math.floor(Math.random() * 5)),
    }))
  );

  await UserAction.insertMany(
    userActionFixtures.map(data => {
      return {
        ...data,
        deviceId: deviceId,
        userId: userId,
        createdAt: new Date(now - hour * Math.floor(Math.random() * 5)),
      };
    })
  );

  await mongoose.disconnect();
  console.log('Done');
};

seed().catch(error => {
  console.error('Seed failed:', error);
  process.exit(1);
});
