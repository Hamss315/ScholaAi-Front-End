import ResetPasswordLayout from "../components/ResetPasswordLayout";
import ResetPasswordNewForm from "../components/ResetPasswordNewForm";

export default function ResetPasswordNewPage() {
  return (
    <ResetPasswordLayout
      title="Choose a New Password"
      subtitle="Enter your new password below"
      footerText="Make sure your password is strong and unique"
    >
      <ResetPasswordNewForm />
    </ResetPasswordLayout>
  );
}
