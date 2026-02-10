import { useAuth } from "@/lib/auth";
import { usePermissions } from "@/hooks/use-permissions";
import { RoleBadge } from "@/components/ui/role-badge";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle, User, Shield } from "lucide-react";
import { useState } from "react";

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

  const handleBlockToggle = (checked: boolean) => {
    setBlockExpiredUploads(checked);
    localStorage.setItem(CONSENT_BLOCK_KEY, String(checked));
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
