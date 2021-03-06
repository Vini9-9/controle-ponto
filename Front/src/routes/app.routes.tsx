import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import Application from '../pages/Application';
import DailyTS from '../pages/Application/dailyTS';
import screenStyles from './screenStyles';
import MonthTS from '../pages/Application/monthTS';

const AppStack = createStackNavigator();

const AppRoutes: React.FC = () => {

    return (
    <AppStack.Navigator>
        <AppStack.Screen 
        name="Home" component={Application}
        options={screenStyles.Login.options}
        />
        <AppStack.Screen 
        name="Daily Time sheet" component={DailyTS}
        options={screenStyles.Login.options}
        />
        <AppStack.Screen 
        name="Time sheet" component={MonthTS}
        options={screenStyles.Login.options}
        />
    </AppStack.Navigator>
)};

export default AppRoutes;
