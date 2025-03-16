
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProject } from "@/contexts/ProjectContext";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Project name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function NewProjectForm() {
  const { createProject } = useProject();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: FormValues) {
    const newProject = createProject(values.name, values.description);
    navigate(`/project/${newProject.id}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="My Awesome Project" {...field} />
              </FormControl>
              <FormDescription>
                Choose a descriptive name for your project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your project in detail..."
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide a detailed description of what you want the AI to build for you.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Create Project</Button>
        </div>
      </form>
    </Form>
  );
}
