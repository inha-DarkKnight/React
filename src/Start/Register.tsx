import React, { useState, useEffect } from 'react';

function Register() {
    const [name, setName] = useState<string>('');
    const [user_id, setuser_id] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
  
    const isMatch = password === confirmPassword;
    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    
        if (!isMatch) {
          alert('암호와 암호 재확인이 일치하지 않습니다.');
          return;
        }
    
        // 회원가입 로직
      };
      return (
        <div className="Register-form">
          <div className="input-group">
            <label htmlFor="name">이름</label>
            <input type="text" id="name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
          </div>
          <div className="input-group">
            <label htmlFor="user_id">아이디</label>
            <input type="text" id="user_id" value={user_id} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setuser_id(e.target.value)} />
          </div>
          <div className="input-group">
            <label htmlFor="password">암호</label>
            <input type="password" id="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">암호 재확인</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} />
          </div>
          <div className="input-group">
            <label htmlFor="email">이메일</label>
            <input type="text" id="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
          </div>
          <button onClick={handleSubmit} className="signup-button">회원가입</button>
        </div>
      );
}
export default Register;