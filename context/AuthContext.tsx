import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = { user_id:number; name:string; email:string } | null;
type AuthCtx = { user:User; setUser:(u:User)=>void; logout:()=>Promise<void>; ready:boolean };

const Ctx = createContext<AuthCtx>({ user:null, setUser:()=>{}, logout:async()=>{}, ready:false });
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children:React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => { (async () => {
    try {
      const u = await AsyncStorage.getItem('user');
      if (u) setUser(JSON.parse(u));
    } finally {
      setReady(true); // δηλωση πως φορτώσαμε από το storage κομπλε
    }
  })(); }, []);

  const logout = async () => {
    await AsyncStorage.multiRemove(['token','user']);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, setUser, logout, ready }}>{children}</Ctx.Provider>;
}
