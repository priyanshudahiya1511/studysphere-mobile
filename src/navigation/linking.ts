import { LinkingOptions } from '@react-navigation/native';

export const linking: LinkingOptions<any> = {
  prefixes: ['studysphere://'],
  config: {
    screens: {
      Home: {
        screens: {
          HomeMain: 'home',
        },
      },
      Planner: 'planner',
      Library: {
        screens: {
          DocumentDetail: 'document/:documentId',
        },
      },
    },
  },
};
