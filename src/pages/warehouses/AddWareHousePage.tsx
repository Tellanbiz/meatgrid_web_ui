import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/breadcrumbs";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Textarea } from "../../components/ui/textarea";

const AddWareHousePage = () => {
  const naviagate = useNavigate();

  const handleCancel = () => {
    naviagate(-1);
  };

  return (
    <div className="h-full">
      <Breadcrumbs
        items={[
          {
            label: "Warehouses",
            to: "/warehouses",
          },
          {
            label: "Add Store",
            isPage: true,
          },
        ]}
      />

      <div className="mt-4">
        <div className="card">
          <div className="grid grid-cols-2 gap-x-10">
            <div className="space-y-6">
              <div className="flex flex-col gap-y-2">
                <Label>Store Name</Label>
                <Input placeholder="Name of the store" />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label>
                  Description
                  <span className="text-xs font-light text-gray-400 leading-none -ml-1">
                    Optional
                  </span>
                </Label>
                <Textarea
                  placeholder="Description"
                  className="resize-none"
                  rows={3}
                />
              </div>

              <div className="flex flex-col gap-y-2">
                <Label>Address</Label>
                <Input placeholder="Address of the store e.g. Kajiado" />
              </div>

              <div className="flex flex-col gap-y-2">
                <Label>Building Name</Label>
                <Input placeholder="Building" />
              </div>

              <div className="grid grid-cols-2 space-x-2">
                <div className="flex flex-col space-y-2">
                  <Label>
                    Latitude
                    <span className="text-xs text-gray-400 font-light -ml-1">
                      Optional
                    </span>
                  </Label>
                  <Input type="number" placeholder="-2.98759" />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label>
                    Longitude
                    <span className="text-xs text-gray-400 font-light -ml-1">
                      Optional
                    </span>
                  </Label>
                  <Input type="number" placeholder="31.2568" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col gap-y-3">
                <Label>Store Type</Label>
                <div className="flex gap-y-2 space-x-3">
                  <Checkbox id="is_warehouse" />
                  <Label
                    htmlFor="is_warehouse"
                    className="text-gray-500 w-full"
                  >
                    Is WareHouse
                  </Label>
                </div>

                <div className="flex gap-y-2 space-x-3">
                  <Checkbox id="is_store" />
                  <Label htmlFor="is_store" className="text-gray-500 w-full">
                    Is Store
                  </Label>
                </div>
              </div>

              <div className="flex flex-col gap-y-3">
                <Label>Store Status</Label>
                <RadioGroup defaultValue="active">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="active" id="active" />
                    <Label htmlFor="active" className="text-gray-500 w-full">
                      Active
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="inactive" id="inactive" />
                    <Label htmlFor="inactive" className="text-gray-500 w-full">
                      Inactive
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" className="mr-2" onClick={handleCancel}>
              Cancel
            </Button>
            <Button>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWareHousePage;
