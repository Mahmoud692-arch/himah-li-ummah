"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Container from "@/components/layout/Container";
import Page from "@/components/layout/Page";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { interactionService } from "@/lib/supabase/interactions";
import toast from "react-hot-toast";

interface AnonymousMessageForm {
  text: string;
}

export default function SarrahniPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AnonymousMessageForm>();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: AnonymousMessageForm) => {
    try {
      setIsLoading(true);
      await interactionService.submitAnonymousMessage(data.text);
      toast.success("تم إرسال رسالتك بنجاح 🎉");
      reset();
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error: any) {
      toast.error(error.message || "خطأ في إرسال الرسالة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page rtl>
      <Container className="py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold text-islamic-700">💬 صراحني</h1>
            <p className="text-lg text-muted-foreground">
              شارك آراءك ومشاعرك بسرية تامة. رسالتك ستبقى مجهولة الهوية 🤫
            </p>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>شارك ما في بالك</CardTitle>
              <CardDescription>
                رسالتك ستُرسل للمسؤولين للمراجعة. لا تقلق، هويتك آمنة معنا 🔐
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <textarea
                  placeholder="اكتب رسالتك هنا... (يمكنك مشاركة أي شيء)"
                  {...register("text", {
                    required: "الرسالة مطلوبة",
                    minLength: { value: 10, message: "الرسالة يجب أن تكون 10 أحرف على الأقل" },
                  })}
                  className="w-full h-48 p-4 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                {errors.text && (
                  <p className="text-destructive text-sm">{errors.text.message}</p>
                )}

                <div className="bg-muted p-4 rounded-md text-sm text-muted-foreground">
                  <p className="font-semibold mb-2">📋 الإرشادات:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>كن محترماً وإيجابياً</li>
                    <li>تجنب اللغة المسيئة</li>
                    <li>لا تشارك معلومات شخصية</li>
                    <li>شارك أفكاراً بناءة</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full"
                  size="lg"
                >
                  إرسال الرسالة 🚀
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Success Message */}
          {submitted && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="text-4xl">✅</div>
                  <h3 className="text-lg font-semibold">شكراً لك!</h3>
                  <p className="text-muted-foreground">
                    تم استقبال رسالتك بنجاح. سيتم مراجعتها من قبل فريقنا قريباً.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="font-semibold mb-2">آمن تماماً</h3>
                <p className="text-sm text-muted-foreground">
                  هويتك مخفية تماماً ولن نعرف من أرسل الرسالة
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-3">🤝</div>
                <h3 className="font-semibold mb-2">مسؤول</h3>
                <p className="text-sm text-muted-foreground">
                  فريق إدارتنا سيرد على رسالتك بكل احترافية
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-3">⭐</div>
                <h3 className="font-semibold mb-2">مؤثر</h3>
                <p className="text-sm text-muted-foreground">
                  آراؤك مهمة وتساعدنا على التطور والتحسن
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </Page>
  );
}
