import MockFirebase from 'mock-cloud-firestore';

jest.mock('react-native-firebase', () => new MockFirebase());
jest.mock('src/models/locale', () => 'en');
