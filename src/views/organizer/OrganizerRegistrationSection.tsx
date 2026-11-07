import React, { useEffect, useState } from 'react';
import { 
  Building, 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  ShieldCheck, 
  Send, 
  Paperclip, 
  Trash2,
  ExternalLink,
  Info
} from 'lucide-react';
import { OrganizerApplication, ApplicationStatus } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { supabaseService } from '../../lib/supabase';

interface OrganizerRegistrationSectionProps {
  application: OrganizerApplication;
  userId?: string;
  onUpdateApplication: (app: OrganizerApplication) => boolean | Promise<boolean>;
}

export const OrganizerRegistrationSection: React.FC<OrganizerRegistrationSectionProps> = ({
  application,
  userId,
  onUpdateApplication
}) => {
  const currentStatusView = application.status;

  // Form states
  const [orgName, setOrgName] = useState(application.organizationName);
  const [legalName, setLegalName] = useState(application.legalName);
  const [orgType, setOrgType] = useState(application.organizationType);
  const [regNumber, setRegNumber] = useState(application.registrationNumber);
  const [email, setEmail] = useState(application.email);
  const [phone, setPhone] = useState(application.phone);
  const [address, setAddress] = useState(application.physicalAddress);
  const [city, setCity] = useState(application.city);
  const [website, setWebsite] = useState(application.website);
  const [description, setDescription] = useState(application.description);
  const [documents, setDocuments] = useState(application.documents);
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setOrgName(application.organizationName);
    setLegalName(application.legalName);
    setOrgType(application.organizationType);
    setRegNumber(application.registrationNumber);
    setEmail(application.email);
    setPhone(application.phone);
    setAddress(application.physicalAddress);
    setCity(application.city);
    setWebsite(application.website);
    setDescription(application.description);
    setDocuments(application.documents);
  }, [application]);

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!userId) {
      setUploadError('Sign in before uploading verification documents.');
      return;
    }
    setUploadError(null);
    const result = await supabaseService.uploadOrganizerDocument(userId, file);
    if (!result.success || !result.path) {
      setUploadError(result.error || 'Document upload failed.');
      return;
    }
    setDocuments(prev => [...prev, {
      id: result.path!,
      name: file.name,
      size: `${(file.size / 1024).toFixed(0)} KB`,
      type: file.type || 'Document',
      uploadedAt: new Date().toISOString(),
      fileUrl: result.path
    }]);
    e.target.value = '';
  };

  const handleRemoveDoc = async (id: string) => {
    const document = documents.find(item => item.id === id);
    if (!document) return;
    if (document.fileUrl && userId) {
      const result = await supabaseService.deleteOrganizerDocument(userId, document.fileUrl);
      if (!result.success) {
        setUploadError(result.error || 'Document deletion failed.');
        return;
      }
    }
    setDocuments(prev => prev.filter(documentItem => documentItem.id !== id));
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: OrganizerApplication = {
      ...application,
      organizationName: orgName,
      legalName,
      organizationType: orgType,
      registrationNumber: regNumber,
      email,
      phone,
      physicalAddress: address,
      city,
      website,
      description,
      documents,
      status: 'submitted',
      submittedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const saved = await onUpdateApplication(updated);
    if (!saved) return;
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#16081c] border border-[#32133b] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#a78bfa]">
            Compliance & Verification
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-0.5">
            Organiser Registration & Verification
          </h2>
          <p className="text-xs text-[#9f8fa9] mt-0.5">
            Complete your business profile and upload supporting documentation to publish public events on NyasaTickets
          </p>
        </div>

        {/* State Simulator Switcher to review all 4 required status screens */}
      </div>

      {/* 2. Process Explanation Ribbon */}
      <div className="p-5 rounded-3xl bg-[#1b0a21] border border-[#32133b] space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-[#8b7bff]" />
          <span>The Organiser Verification Journey in Malawi</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-[#b8a6c2]">
          <div className="p-3 rounded-xl bg-[#220d2b] border border-[#391544] space-y-1">
            <span className="font-bold text-white block">1. Company Profile</span>
            <p className="text-[11px] text-[#9a86a3]">Submit your registered company name, MRA TIN, and physical address.</p>
          </div>
          <div className="p-3 rounded-xl bg-[#220d2b] border border-[#391544] space-y-1">
            <span className="font-bold text-white block">2. Supporting Docs</span>
            <p className="text-[11px] text-[#9a86a3]">Upload Certificate of Incorporation, Tax Clearance, and Director ID.</p>
          </div>
          <div className="p-3 rounded-xl bg-[#220d2b] border border-[#391544] space-y-1">
            <span className="font-bold text-white block">3. Compliance Review</span>
            <p className="text-[11px] text-[#9a86a3]">NyasaTickets verifies venue agreements and event promoter credentials.</p>
          </div>
          <div className="p-3 rounded-xl bg-[#220d2b] border border-[#391544] space-y-1">
            <span className="font-bold text-white block">4. Direct Publishing</span>
            <p className="text-[11px] text-[#9a86a3]">Approved organisers can create and publish events with Airtel Money & Mpamba.</p>
          </div>
        </div>
      </div>

      {/* 3. APPLICATION STATUS SCREENS */}

      {/* STATUS: SUBMITTED */}
      {currentStatusView === 'submitted' && (
        <div className="p-8 rounded-3xl bg-[#170a1c] border border-sky-800/60 text-center space-y-3 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-sky-950/80 border border-sky-700/60 flex items-center justify-center text-sky-400 mx-auto">
            <Send className="w-7 h-7" />
          </div>
          <Badge variant="info">Application Status: Submitted</Badge>
          <h3 className="text-xl font-display font-bold text-white">Application Received by NyasaTickets</h3>
          <p className="text-xs text-[#bda7c7] max-w-md mx-auto leading-relaxed">
            Your organiser verification dossier for <strong>{orgName}</strong> was successfully submitted on {application.submittedAt}. Our verification team will begin review shortly.
          </p>
          {application.id && <p className="text-[11px] text-[#8e7a96] font-mono">Submission Reference: {application.id}</p>}
        </div>
      )}

      {/* STATUS: UNDER REVIEW */}
      {currentStatusView === 'under_review' && (
        <div className="p-8 rounded-3xl bg-[#170a1c] border border-amber-800/60 text-center space-y-3 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400 mx-auto animate-pulse">
            <Clock className="w-7 h-7" />
          </div>
          <Badge variant="warning">Application Status: Under Review</Badge>
          <h3 className="text-xl font-display font-bold text-white">Document Compliance in Progress</h3>
          <p className="text-xs text-[#bda7c7] max-w-md mx-auto leading-relaxed">
            Our compliance team is currently reviewing your MRA Tax Clearance and business registration filings. Reviews are typically completed within 2 business days.
          </p>
          <div className="inline-block p-3 rounded-xl bg-[#220d29] border border-[#3f174e] text-xs text-white">
            Expected review completion: Within 24–48 hours
          </div>
        </div>
      )}

      {/* STATUS: APPROVED */}
      {currentStatusView === 'approved' && (
        <div className="p-8 rounded-3xl bg-[#170a1c] border border-emerald-800/60 text-center space-y-3 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <Badge variant="success">Application Status: Verified & Approved</Badge>
          <h3 className="text-xl font-display font-bold text-white">Official Organiser Accreditation Granted</h3>
          <p className="text-xs text-[#bda7c7] max-w-md mx-auto leading-relaxed">
            <strong>{orgName}</strong> is fully accredited. You possess unrestricted access to publish live events, configure custom ticket tiers, export guest manifests, and deploy gate turnstile staff.
          </p>
        </div>
      )}

      {/* STATUS: REJECTED */}
      {currentStatusView === 'rejected' && (
        <div className="p-8 rounded-3xl bg-[#170a1c] border border-rose-800/60 text-center space-y-3 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border border-rose-700/60 flex items-center justify-center text-rose-400 mx-auto">
            <XCircle className="w-7 h-7" />
          </div>
          <Badge variant="danger">Application Status: Action Required / Resubmit</Badge>
          <h3 className="text-xl font-display font-bold text-white">Documentation Update Required</h3>
          <p className="text-xs text-[#bda7c7] max-w-md mx-auto leading-relaxed">
            Your submission was returned for the following reason: <em className="text-white">{application.reviewFeedback || 'See the review feedback on your application.'}</em>
          </p>
        </div>
      )}

      {/* 4. Complete Application Form (View & Edit) */}
      <div className="p-6 rounded-3xl bg-[#170a1c] border border-[#301337] space-y-6">
        <div className="border-b border-[#291030] pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-display font-bold text-white">Organiser Application Profile</h3>
            <p className="text-xs text-[#9f8fa9]">Review or edit your organisation submission details</p>
          </div>
          <Building className="w-5 h-5 text-[#a78bfa]" />
        </div>

        <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#a491ae] mb-1 font-medium">Organisation / Business Name *</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3e174b] text-white"
              />
            </div>

            <div>
              <label className="block text-[#a491ae] mb-1 font-medium">Full Registered Legal Entity Name *</label>
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3e174b] text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#a491ae] mb-1 font-medium">Organisation Type *</label>
              <select
                value={orgType}
                onChange={(e) => setOrgType(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3e174b] text-white"
              >
                <option value="" disabled>Select an organisation type</option>
                <option value="Promoter / Entertainment">Promoter / Music & Entertainment</option>
                <option value="Cultural Trust / NGO">Cultural Trust / Arts Foundation / NGO</option>
                <option value="Venue Operator">Venue Operator / Hospitality</option>
                <option value="Sports Federation">Sports Club / Marathon Organizer</option>
                <option value="Corporate Brand">Corporate Agency / Brand</option>
              </select>
            </div>

            <div>
              <label className="block text-[#a491ae] mb-1 font-medium">Malawi Registration / MRA TIN Number</label>
              <input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="e.g. MBR-104928-2022"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3e174b] text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#a491ae] mb-1 font-medium">Contact Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3e174b] text-white"
              />
            </div>

            <div>
              <label className="block text-[#a491ae] mb-1 font-medium">Business Phone *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3e174b] text-white"
              />
            </div>

            <div>
              <label className="block text-[#a491ae] mb-1 font-medium">City Location</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3e174b] text-white"
              >
                <option value="Blantyre">Blantyre</option>
                <option value="Lilongwe">Lilongwe</option>
                <option value="Mzuzu">Mzuzu</option>
                <option value="Zomba">Zomba</option>
                <option value="Mangochi">Mangochi</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#a491ae] mb-1 font-medium">Physical Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3e174b] text-white"
              />
            </div>

            <div>
              <label className="block text-[#a491ae] mb-1 font-medium">Official Website / Portfolio</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3e174b] text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#a491ae] mb-1 font-medium">Organisation Profile & History</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1f0c26] border border-[#3e174b] text-white"
            />
          </div>

          {/* Supporting Documents Upload Interface */}
          <div className="pt-3 border-t border-[#291030] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Supporting Verification Documents
                </span>
                <p className="text-[11px] text-[#9a87a4]">
                  Upload PDF or JPG copies of Certificate of Incorporation, MRA Tax Clearance, and Director IDs.
                </p>
              </div>

              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a0e33] hover:bg-[#391444] border border-[#521c64] text-xs text-white font-medium cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-[#a78bfa]" />
                <span>Upload Document</span>
                <input
                  type="file"
                  onChange={handleDocumentUpload}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
            </div>

            <div className="space-y-2">
              {uploadError && <p role="alert" className="text-xs text-rose-300">{uploadError}</p>}
              {documents.map((doc) => (
                <div key={doc.id} className="p-3 rounded-xl bg-[#200d27] border border-[#36133f] flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Paperclip className="w-4 h-4 text-[#8b7bff] shrink-0" />
                    <span className="font-semibold text-white truncate">{doc.name}</span>
                    <span className="text-[#8c7895] text-[10px]">({doc.size} · Uploaded {doc.uploadedAt})</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(doc.id)}
                    className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                    title="Remove document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <Button variant="primary" size="md" type="submit">
              Save Application Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
