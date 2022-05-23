import React, { HTMLAttributes, useCallback } from "react";
import * as Realm from "realm-web";

interface RealmAppContextType {
  app: Realm.App;
  currentUser: Realm.User | null;
  logIn: (token: string) => void;
  logOut: () => void;
}
const RealmAppContext = React.createContext<RealmAppContextType>({
  app: new Realm.App(""),
  currentUser: null,
  logIn: () => {},
  logOut: () => {},
});

export const useRealmApp = () => {
  const app = React.useContext(RealmAppContext);
  if (!app) {
    throw new Error(
      `You must call useRealmApp() inside of a <RealmAppProvider />`
    );
  }
  return app;
};

export const RealmAppProvider = ({
  children,
}: HTMLAttributes<HTMLDivElement>) => {
  const appId = "kws-realm-royfw";
  const [app, setApp] = React.useState(new Realm.App(appId));
  React.useEffect(() => {
    setApp(new Realm.App(appId));
  }, [appId]);
  const [currentUser, setCurrentUser] = React.useState<Realm.User | null>(
    app.currentUser
  );

  const logIn = useCallback(
    async (token: string): Promise<Realm.User | null> => {
      const credentials = Realm.Credentials.jwt(token);
      await app.logIn(credentials);
      if (currentUser?.id !== app.currentUser?.id) {
        setCurrentUser(app.currentUser);
      }
      return app.currentUser;
    },
    [app, currentUser]
  );
  const logOut = useCallback(async () => {
    await app.currentUser?.logOut();
    setCurrentUser(app.currentUser);
  }, [app]);

  return (
    <RealmAppContext.Provider value={{ app, currentUser, logIn, logOut }}>
      {children}
    </RealmAppContext.Provider>
  );
};
