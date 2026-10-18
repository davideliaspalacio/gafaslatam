"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin/actions";
import { Button, Input, Label } from "@/components/admin/ui";

export function LoginForm({ notice }: { notice: string | null }) {
  const [state, action, pending] = useActionState(signIn, null);
  const message = state?.message ?? notice;
  return (
    <form action={action} className="space-y-5 px-5 pt-6 pb-6">
      <div>
        <Label htmlFor="email">Correo</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {message ? (
        <p role="alert" className="text-sm text-alert">
          {message}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}
