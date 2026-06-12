import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCourseMutation, useUploadThumbnailMutation } from "@/store/services/course-service";
import { getApiErrorMessage } from "@/lib/api-error";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import FileUpload from "@/components/ui/course/file-upload";
import { useRef } from "react";

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const [createCourse, { isLoading }] = useCreateCourseMutation();
  const [uploadThumbnail, { isLoading: isUploading }] = useUploadThumbnailMutation();
  const fileRef = useRef(null);

  function getFileData() {
    const formData = new FormData();
    formData.append("thumbnail", fileRef.current);
    return formData;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title")?.trim();
    const description = formData.get("description")?.trim();

    if (!title || !description) {
      toast.error("Title and description are required.", { position: "bottom-center" });
      return;
    }

    if (!fileRef.current) {
      toast.error("Please choose a thumbnail image.", { position: "bottom-center" });
      return;
    }

    try {
      const thumbnailFile = getFileData();
      const { thumbnailUrl } = await uploadThumbnail(thumbnailFile).unwrap();
      if (thumbnailUrl) {
        const course = await createCourse({
          title,
          description,
          thumbnail: thumbnailUrl,
        }).unwrap();
        toast.success("Course created.", { position: "bottom-center" });
        navigate(`/courses/${course._id}`);
      } else {
        toast.error("Thumbnail upload failed. Please try again.", { position: "bottom-center" });
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to create course."), { position: "bottom-center" });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create course</CardTitle>
        <CardDescription>Add a title, description, and thumbnail for a new course.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input id="title" name="title" placeholder="React Fundamentals" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea id="description" name="description" placeholder="What students will learn" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="thumbnail">Thumbnail</FieldLabel>

              <FileUpload
                title="Upload thumbnail"
                description="Upload a thumbnail image for your course."
                buttonText="Choose File"
                onFileSelect={(file) => {
                  fileRef.current = file;
                }}
              />
              {/* <Input id="thumbnail" name="thumbnail" placeholder="https://example.com/course.jpg" /> */}
            </Field>
          </FieldGroup>
          <Button type="submit" className="w-fit" disabled={isLoading || isUploading}>
            {isUploading ? "Uploading..." : isLoading ? "Creating..." : "Create course"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
