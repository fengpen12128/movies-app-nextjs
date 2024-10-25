import { Button, Dialog } from "@radix-ui/themes";
import { Upload } from "lucide-react";

interface ImageUploadDialogProps {
  onImageUpload: (base64: string) => void;
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  onImageUpload,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(",")[1];
        onImageUpload(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
            <Upload className="w-4 h-4 text-white" />
          </div>
        </div>
      </Dialog.Trigger>

      <Dialog.Content className="bg-zinc-900">
        <Dialog.Title className="text-white">Upload Avatar</Dialog.Title>
        <Dialog.Description size="2" mb="4" className="text-gray-400">
          Choose an image file to upload
        </Dialog.Description>

        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-zinc-800 hover:bg-zinc-700 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-400" />
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG or GIF</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>

        <div className="mt-4 flex justify-end gap-3">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ImageUploadDialog;
