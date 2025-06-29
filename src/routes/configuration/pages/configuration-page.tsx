import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchAccounts, updateConfiguration } from "../domain/configuration-api";
import { Configuration } from "../domain/models";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@iconify/react";

const ConfigurationPage: React.FC = () => {
  const [configuration, setConfiguration] = useState<Configuration | null>(null);
  const [form, setForm] = useState<{ free_delivery: boolean }>({ free_delivery: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    loadConfiguration();
    // eslint-disable-next-line
  }, []);

  const loadConfiguration = async () => {
    try {
      setLoading(true);
      setError(null);
      const config = await fetchAccounts();
      setConfiguration(config);
      setForm({ free_delivery: config.free_delivery });
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to load configuration settings");
      toast.error("Failed to load configuration settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (checked: boolean) => {
    setForm((prev) => ({ ...prev, free_delivery: checked }));
  };

  const handleSave = async () => {
    if (!configuration) return;
    setSaving(true);
    setError(null);
    try {
      const apiError = await updateConfiguration(form.free_delivery);
      if (apiError) {
        setError(apiError);
        toast.error(apiError);
        return;
      }
      setConfiguration({ ...configuration, free_delivery: form.free_delivery });
      setLastUpdated(new Date());
      toast.success("Configuration updated successfully");
    } catch (err) {
      setError("Failed to update configuration");
      toast.error("Failed to update configuration");
    } finally {
      setSaving(false);
    }
  };

  const isChanged = configuration && configuration.free_delivery !== form.free_delivery;

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      <div className="flex items-center gap-4 mb-2">
        <span className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
          <Icon icon="solar:settings-linear" className="text-primary w-7 h-7" />
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage system-wide settings for your platform. Changes here affect all users.
          </p>
        </div>
      </div>
      <Separator />
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading configuration...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center text-destructive py-8">
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={loadConfiguration}>
            Retry
          </Button>
        </div>
      ) : (
        <form
          className="space-y-8"
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Delivery Settings</CardTitle>
              <CardDescription>
                Configure delivery-related settings for your platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="free-delivery" className="text-base">
                    Free Delivery
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable free delivery for all orders.
                  </p>
                </div>
                <Switch
                  id="free-delivery"
                  checked={form.free_delivery}
                  onCheckedChange={handleChange}
                  disabled={saving}
                  aria-label="Toggle free delivery for all orders"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-4 justify-between">
            <div className="text-xs text-muted-foreground">
              {lastUpdated && (
                <span>Last updated: {lastUpdated.toLocaleString()}</span>
              )}
            </div>
            <Button
              type="submit"
              disabled={!isChanged || saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                Current system configuration details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Free Delivery Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    configuration?.free_delivery
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {configuration?.free_delivery ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
};

export default ConfigurationPage;
