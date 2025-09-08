import { useState } from "react";
import { login, me, logout } from "@/api/auth";

export default function LoginDemo() {
  const [email, setEmail] = useState("springboot@a.com");
  const [password, setPassword] = useState("password");
  const [profile, setProfile] = useState<any>(null);
  const [msg, setMsg] = useState("");

  async function onLogin() {
    try {
      await login(email, password);
      setMsg("로그인 성공");
    } catch (e:any) {
      setMsg("로그인 실패: " + (e?.response?.data?.message || e.message));
    }
  }
  async function onMe() {
    try {
      const p = await me();
      setProfile(p);
      setMsg("프로필 로드");
    } catch (e:any) {
      setMsg("프로필 실패: " + (e?.response?.data?.message || e.message));
    }
  }
  async function onLogout() {
    await logout();
    setProfile(null);
    setMsg("로그아웃");
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">백-프론트 연결 데모</h1>
      <div className="space-y-2">
        <input className="border p-2" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
        <input className="border p-2" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" />
      </div>
      <div className="flex gap-2">
        <button className="border px-3 py-2" onClick={onLogin}>로그인</button>
        <button className="border px-3 py-2" onClick={onMe}>프로필</button>
        <button className="border px-3 py-2" onClick={onLogout}>로그아웃</button>
      </div>
      <div className="text-sm text-gray-500">{msg}</div>
      <pre className="bg-gray-50 p-3 rounded">{JSON.stringify(profile, null, 2)}</pre>
    </div>
  );
}