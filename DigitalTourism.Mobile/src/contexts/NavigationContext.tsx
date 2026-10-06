import React, { createContext, useContext, useState } from 'react';
import { useNavigationState } from '@react-navigation/native';

interface NavigationContextType {
  isInTabNavigator: boolean;
  setIsInTabNavigator: (value: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  isInTabNavigator: false,
  setIsInTabNavigator: () => {},
});

/**
 * Provider that holds navigation state
 * Can be used outside NavigationContainer
 */
export function NavigationContextProvider({ children }: { children: React.ReactNode }) {
  const [isInTabNavigator, setIsInTabNavigator] = useState(false);

  return (
    <NavigationContext.Provider value={{ isInTabNavigator, setIsInTabNavigator }}>
      {children}
    </NavigationContext.Provider>
  );
}

/**
 * Component that tracks navigation state and updates the context
 * Must be used inside a navigator (Stack.Navigator)
 */
export function NavigationStateTracker() {
  const { setIsInTabNavigator } = useContext(NavigationContext);

  // Detect if we're in a tab navigator screen
  const currentIsInTab = useNavigationState(state => {
    if (!state) return false;
    // Check if current route is 'Main' which contains the tab navigator
    const currentRoute = state.routes[state.index];
    return currentRoute?.name === 'Main';
  }) ?? false;

  React.useEffect(() => {
    setIsInTabNavigator(currentIsInTab);
  }, [currentIsInTab, setIsInTabNavigator]);

  return null; // This component doesn't render anything
}

/**
 * Hook to access navigation state from anywhere
 */
export function useNavigationContext(): NavigationContextType {
  return useContext(NavigationContext);
}
