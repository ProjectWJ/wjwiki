import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  // FieldDescription,
  FieldGroup,
  FieldLabel,
  // FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authenticate } from '@/lib/auth.actions';
import { useActionState } from 'react';
import { useFormStatus } from "react-dom"
import { Spinner } from "./ui/spinner"
import { Button } from "./ui/button";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);
  
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input 
                  id="password"
                  type="password"
                  name="password"
                  required
                />
              </Field>
              <Field>
                <SubmitButton text="Login" />
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
        {/* 에러 메시지 표시 */}
        {errorMessage && <p className={"flex justify-center text-red-500 mt-2"}>{errorMessage}</p>}
      </Card>
    </div>
  )
}

export function SubmitButton(props: { text: string; }) {
  const { pending } = useFormStatus();

  return (
    <Button 
      disabled={pending}
      type="submit"
      >{pending ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          {props.text}
        </>
      )}
    </Button>
  )
}
