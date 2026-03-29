import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/Input";

export function StepInformation() {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="First Name" placeholder="John" {...register("firstName")} error={errors.firstName?.message} />
        <Input label="Last Name" placeholder="Doe" {...register("lastName")} error={errors.lastName?.message} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Email Address" type="email" placeholder="john@example.com" {...register("email")} error={errors.email?.message} />
        <Input label="Phone Number" placeholder="+91 98765 43210" {...register("phone")} error={errors.phone?.message} />
      </div>
    </div>
  );
}
