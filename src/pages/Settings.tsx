import { useAuth } from "@/lib/auth";
import { usePermissions } from "@/hooks/use-permissions";
import { RoleBadge } from "@/components/ui/role-badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertTriangle, User, Shield, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const CONSENT_BLOCK_KEY = "consentmap:block-expired-uploads";

const Settings = () => {
  const { user } = useAuth();
  const { isAdmin } = usePermissions();

  // Simulated account creation date (use registered user data or fallback)
  const accountCreated = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days ago for demo
  const validUntil = new Date(accountCreated);
  validUntil.setFullYear(validUntil.getFullYear() + 3);

  const now = new Date();
  const daysUntilExpiry = Math.ceil((validUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isExpired = daysUntilExpiry <= 0;
  const isNearExpiry = daysUntilExpiry > 0 && daysUntilExpiry <= 30;

  // Consent settings (admin only)
  const [blockExpiredUploads, setBlockExpiredUploads] = useState(() => {
    try {
      return localStorage.getItem(CONSENT_BLOCK_KEY) === "true";
    } catch {
      return false;
    }
  });

  // Email edit state
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  // Password edit state
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleBlockToggle = (checked: boolean) => {
    setBlockExpiredUploads(checked);
    localStorage.setItem(CONSENT_BLOCK_KEY, String(checked));
  };

  const handleEmailSave = () => {
    if (!newEmail.trim()) {
      toast({ title: "Error", description: "Email cannot be empty.", variant: "destructive" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      toast({ title: "Error", description: "Please enter a valid email.", variant: "destructive" });
      return;
    }
    // Update in localStorage (demo only)
    const stored = localStorage.getItem("consent-map-auth");
    if (stored) {
      const userData = JSON.parse(stored);
      userData.email = newEmail.toLowerCase();
      localStorage.setItem("consent-map-auth", JSON.stringify(userData));
    }
    toast({ title: "Email updated", description: "Your email has been changed. Please re-login for changes to take effect." });
    setIsEditingEmail(false);
    setNewEmail("");
  };

  const handlePasswordSave = () => {
    if (!newPassword.trim()) {
      toast({ title: "Error", description: "Password cannot be empty.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    // Update in registered users (demo only)
    const usersStr = localStorage.getItem("consentmap:users");
    if (usersStr && user) {
      const users = JSON.parse(usersStr);
      const idx = users.findIndex((u: any) => u.email === user.email);
      if (idx !== -1) {
        users[idx].password = newPassword;
        localStorage.setItem("consentmap:users", JSON.stringify(users));
      }
    }
    toast({ title: "Password updated", description: "Your password has been changed." });
    setIsEditingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (!user) return null;

  return (
    <div className="p-6 max-w-2xl animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      {/* Section 1: Account & Validity */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Account & Validity
          </h2>
        </div>
        <div className="space-y-3 border border-border rounded-lg p-4 bg-card">
          <Row label="Username" value={user.name} />
          <Row label="Email" value={user.email} />
          <Row label="Role">
            <RoleBadge role={user.role} />
          </Row>
          <Row label="Account Created" value={accountCreated.toLocaleDateString()} />
          <Row label="Valid Until" value={validUntil.toLocaleDateString()} />
        </div>

        {(isExpired || isNearExpiry) && (
          <div className={`mt-3 flex items-center gap-2 text-sm ${isExpired ? "text-destructive" : "text-warning"}`}>
            <AlertTriangle className="h-4 w-4" />
            <span>
              {isExpired
                ? "Your account has expired. Please contact your administrator."
                : `Your account expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? "s" : ""}.`}
            </span>
          </div>
        )}
      </section>

      {/* Section 2: Edit Account */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Pencil className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Edit Account
          </h2>
        </div>
        <div className="space-y-4 border border-border rounded-lg p-4 bg-card">
          {/* Email Edit */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              {!isEditingEmail && (
                <Button variant="ghost" size="sm" onClick={() => { setIsEditingEmail(true); setNewEmail(user.email); }}>
                  <Pencil className="h-3 w-3 mr-1" /> Edit
                </Button>
              )}
            </div>
            {isEditingEmail && (
              <div className="mt-2 space-y-2">
                <Label htmlFor="new-email" className="text-xs text-muted-foreground">New Email</Label>
                <Input id="new-email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="new@example.com" />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleEmailSave}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => { setIsEditingEmail(false); setNewEmail(""); }}>Cancel</Button>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border" />

          {/* Password Edit */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Password</span>
              {!isEditingPassword && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditingPassword(true)}>
                  <Pencil className="h-3 w-3 mr-1" /> Edit
                </Button>
              )}
            </div>
            {isEditingPassword && (
              <div className="mt-2 space-y-2">
                <div>
                  <Label htmlFor="current-password" className="text-xs text-muted-foreground">Current Password</Label>
                  <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="new-password" className="text-xs text-muted-foreground">New Password</Label>
                  <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="confirm-password" className="text-xs text-muted-foreground">Confirm Password</Label>
                  <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handlePasswordSave}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => { setIsEditingPassword(false); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }}>Cancel</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 2: Consent & Compliance (Admin only) */}
      {isAdmin && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Consent & Compliance
            </h2>
          </div>
          <div className="space-y-3 border border-border rounded-lg p-4 bg-card">
            <Row label="Consent Validity Period" value="3 years" />
            <Row label="Default Consent Status" value="Pending" />
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm text-muted-foreground">Block uploads after consent expiry</span>
              <Switch checked={blockExpiredUploads} onCheckedChange={handleBlockToggle} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

function Row({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children || <span className="text-sm font-medium text-foreground">{value}</span>}
    </div>
  );
}

export default Settings;
