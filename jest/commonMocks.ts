import MockFirebase from 'mock-cloud-firestore';

jest.mock('react-native-firebase', () => new MockFirebase());
