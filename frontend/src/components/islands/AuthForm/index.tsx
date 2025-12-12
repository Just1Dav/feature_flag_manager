import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { LoginForm } from '@/components/islands/AuthForm/LoginForm';
import { RegisterForm } from '@/components/islands/AuthForm/RegisterForm';

export function AuthForm() {
  return (
    <Card className="border-muted mx-auto w-full max-w-5xl shadow-lg">
      <CardContent className="p-6">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="bg-muted/50 mb-6 grid h-12 w-full grid-cols-2">
            <TabsTrigger
              value="login"
              className="text-base hover:cursor-pointer data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Entrar
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="text-base hover:cursor-pointer data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Cadastrar
            </TabsTrigger>
          </TabsList>

          {/* TAB: LOGIN */}
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>

          {/* TAB: CADASTRAR */}
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
