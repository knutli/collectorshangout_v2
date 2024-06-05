"use client";

import React, { useState } from "react";
import { Button, Input, Checkbox, Link, Divider } from "@nextui-org/react";
import { Icon } from "@iconify/react";

export default function Component() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/login/federated/google`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? `${process.env.REACT_APP_BACKEND_URL}/login`
      : `${process.env.REACT_APP_BACKEND_URL}/register`;

    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        window.location.href = `${process.env.REACT_APP_FRONTEND_URL}`;
      } else {
        const message = isLogin ? "Login failed" : "Registration failed";
        alert(`${message}. Please check your credentials and try again.`);
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center pt-24">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <p className="pb-2 text-xl font-medium">
          {isLogin ? "Log In" : "Sign Up"}
        </p>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            label="Username"
            name="username"
            placeholder="Enter your username"
            type="text"
            variant="bordered"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
            label="Password"
            name="password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {isLogin && (
            <div className="flex items-center justify-between px-1 py-2">
              <Checkbox name="remember" size="sm">
                Remember me
              </Checkbox>
              <Link className="text-default-500" href="#" size="sm">
                Forgot password?
              </Link>
            </div>
          )}

          <Button color="primary" type="submit">
            {isLogin ? "Log In" : "Sign Up"}
          </Button>
        </form>
        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500">OR</p>
          <Divider className="flex-1" />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered"
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </Button>
          {/* You can add more social login buttons here */}
        </div>
        <div className="flex flex-col gap-2">
          <Button
            startContent={<Icon icon="logos:facebook" width={24} />}
            variant="bordered"
            onClick={handleGoogleLogin}
          >
            Continue with Facebook
          </Button>
          {/* You can add more social login buttons here */}
        </div>
        <p className="text-center text-small">
          {isLogin ? "Need to create an account?" : "Already have an account?"}
          &nbsp;
          <Link href="#" size="sm" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Log In"}
          </Link>
        </p>
      </div>
    </div>
  );
}
