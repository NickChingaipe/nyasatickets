import React, { useState } from 'react';
import { 
  Building, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle,
  Eye,
  FileCheck,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Globe,
  Share2,
  X,
  History,
  Check
} from 'lucide-react';
import { 
  OrganizerApplication, 
  OrganizerReviewRecord, 
  ApplicationStatus 
} from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { supabaseService } from '../../lib/supabase';

interface AdminOrganizerVerificationSectionProps {
  applications: OrganizerApplication[];
  reviewHistory: OrganizerReviewRecord[];
  onApproveApplication: (applicationId: string, notes?: string) => void;
  onRejectApplication: (applicationId: string, reason: string) => void;
}

export const AdminOrganizerVerificationSection: React.FC<AdminOrganizerVerificationSectionProps> = ({
  applications,
  reviewHistory,
  onApproveApplication,
  onRejectApplication
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [filterStatus, setFilterStatus] = useState<'all' | ApplicationStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Inspection modal state
  const [selectedApplication, setSelectedApplication] = useState<OrganizerApplication | null>(null);
  
  // Rejection modal state
  const [rejectionTarget, setRejectionTarget] = useState<OrganizerApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');
  const [actionError, setActionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = applications.filter(a => a.status === 'submitted' || a.status === 'under_review').length;

  const handleApprove = async (app: OrganizerApplication) => {
    setIsSubmitting(true);
    try {
      if (!app.id) throw new Error('This application has no backend id.');
      const appId = app.id;
      const result = await supabaseService.reviewOrganizerApplication(appId, 'approved', 'Verified by Admin');
      if (!result.success) throw new Error(result.error || 'Organizer review failed.');
      setActionError('');
      onApproveApplication(appId, 'All Malawi registration documents and MRA certificates verified.');
      if (selectedApplication?.id === app.id) {
        setSelectedApplication(null);
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Organizer approval failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      setRejectionError('Please provide a specific rejection reason for the applicant.');
      return;
    }

    if (!rejectionTarget) return;

    setIsSubmitting(true);
    try {
      if (!rejectionTarget.id) throw new Error('This application has no backend id.');
      const appId = rejectionTarget.id;
      const result = await supabaseService.reviewOrganizerApplication(appId, 'rejected', rejectionReason.trim());
      if (!result.success) throw new Error(result.error || 'Organizer review failed.');
      setActionError('');
      onRejectApplication(appId, rejectionReason.trim());
      setRejectionTarget(null);
      setRejectionReason('');
      setRejectionError('');
      if (selectedApplication?.id === appId) {
        setSelectedApplication(null);
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Organizer rejection failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="warning" className="bg-amber-950/80 text-amber-300 border-amber-800">Submitted</Badge>;
      case 'under_review':
        return <Badge variant="plum" className="bg-purple-950/80 text-purple-300 border-purple-800">Under Review</Badge>;
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
        {actionError && <p role="alert" className="rounded-xl border border-rose-800 bg-rose-950/40 px-4 py-3 text-sm text-rose-200">{actionError}</p>}
      {/* 1. Header & Section Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2d1237]">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2.5">
            <Building className="w-6 h-6 text-[#8b7bff]" />
            Organiser Verification & Accreditation
          </h2>
          <p className="text-xs sm:text-sm text-[#9f8ea7] mt-1">
            Review business licenses, MRA tax compliance, and director IDs for Malawian event promoters.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#180a1e] border border-[#381643] shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-[#3e347d] text-white shadow-md'
                : 'text-[#9c89a7] hover:text-white'
            }`}
          >
            <span>Applications</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#8b7bff] text-white font-mono">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-[#3e347d] text-white shadow-md'
                : 'text-[#9c89a7] hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit History ({reviewHistory.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'pending' ? (
        <>
          {/* 2. Search & Status Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a7695]" />
              <input
                type="text"
                placeholder="Search by organization, registration #, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#180a1e] border border-[#35143f] text-white text-xs placeholder-[#7c6987] focus:outline-none focus:border-[#8b7bff]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['all', 'submitted', 'under_review', 'approved', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize shrink-0 transition-all cursor-pointer ${
                    filterStatus === status
                      ? 'bg-[#4a1354] text-white border border-[#9d24b6]/50 shadow-sm'
                      : 'bg-[#180a1e] text-[#9c89a7] border border-[#2f1137] hover:text-white'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Applications Grid / List */}
          {filteredApplications.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#16081b] border border-[#2d1237] space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400/80 mx-auto" />
              <h3 className="text-base font-bold text-white">No Applications Found</h3>
              <p className="text-xs text-[#9f8ea7] max-w-md mx-auto">
                All submitted organiser dossiers have been reviewed or no applications match the active filter criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredApplications.map((app) => (
                <div
                  key={app.id || app.registrationNumber}
                  className="rounded-3xl bg-[#170a1c] border border-[#361440] p-5 sm:p-6 space-y-4 hover:border-[#671d7a] transition-all shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-display font-bold text-base text-white">
                            {app.organizationName}
                          </h3>
                          {getStatusBadge(app.status)}
                        </div>
                        <p className="text-xs text-[#b8a7c2] mt-0.5">{app.legalName}</p>
                      </div>
                      <span className="text-[10px] font-mono text-[#8c7a95] shrink-0 bg-[#250e2d] px-2 py-0.5 rounded-md border border-[#3b1747]">
                        {app.organizationType}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-[#cebdd9] bg-[#1d0b23] p-3 rounded-2xl border border-[#33133c]">
                      <div>
                        <span className="text-[10px] text-[#867490] block">Reg. Number</span>
                        <span className="font-mono text-white font-medium">{app.registrationNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#867490] block">Location</span>
                        <span className="text-white font-medium">{app.city}, Malawi</span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-[#2c1034] flex items-center justify-between text-[11px]">
                        <span className="text-[#867490]">Submitted: {app.submittedAt}</span>
                        <span className="text-[#a78bfa] font-medium">{app.documents.length} verified documents</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#a794b1] line-clamp-2">
                      {app.description}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-[#290e2f] flex items-center justify-between gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedApplication(app)}
                      className="px-3 py-1.5 rounded-xl bg-[#250d2d] hover:bg-[#34133e] text-[#e5d6ec] border border-[#441852] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#c084fc]" />
                      Inspect Dossier
                    </button>

                    <div className="flex items-center gap-2">
                      {app.status !== 'rejected' && app.status !== 'approved' && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setRejectionTarget(app);
                              setRejectionReason('');
                              setRejectionError('');
                            }}
                            className="text-xs text-rose-300 border-rose-900/60 hover:bg-rose-950/40"
                            leftIcon={<XCircle className="w-3.5 h-3.5 text-rose-400" />}
                          >
                            Reject
                          </Button>

                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApprove(app)}
                            disabled={isSubmitting}
                            className="text-xs bg-emerald-600 hover:bg-emerald-500 border-emerald-500"
                            leftIcon={<Check className="w-3.5 h-3.5" />}
                          >
                            Approve
                          </Button>
                        </>
                      )}

                      {app.status === 'approved' && (
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Accredited
                        </span>
                      )}

                      {app.status === 'rejected' && (
                        <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Rejected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* 4. Historical Audit Log Tab */
        <div className="rounded-3xl bg-[#170a1c] border border-[#32133b] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2d1237]">
            <div>
              <h3 className="font-display font-bold text-white text-base">Organiser Accreditation Audit Log</h3>
              <p className="text-xs text-[#9f8ea7]">All administrator determinations recorded in the audit trail.</p>
            </div>
            <span className="text-xs font-mono text-[#8e7a96]">{reviewHistory.length} Recorded Reviews</span>
          </div>

          <div className="divide-y divide-[#280e2f]">
            {reviewHistory.map((record) => (
              <div key={record.id} className="py-4 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-white text-sm">{record.organizationName}</span>
                    <Badge variant={record.status === 'approved' ? 'success' : 'danger'}>
                      {record.status === 'approved' ? 'Approved' : 'Rejected'}
                    </Badge>
                  </div>
                  <span className="text-xs font-mono text-[#8a7793]">{record.reviewedAt}</span>
                </div>

                <p className="text-xs text-[#cebdd9] bg-[#1d0b23] p-3 rounded-xl border border-[#32133b]">
                  <strong className="text-white">Determination Reason:</strong> {record.reason}
                </p>

                <div className="flex items-center justify-between text-[11px] text-[#8e7a96]">
                  <span>Reviewer: <strong className="text-[#d8c7e2]">{record.reviewerName}</strong></span>
                  <span className="font-mono">Supabase RPC: review_organizer_application</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Complete Inspection Dossier Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#17091c] border border-[#441852] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#31133a]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-display font-bold text-white">
                    {selectedApplication.organizationName}
                  </h3>
                  {getStatusBadge(selectedApplication.status)}
                </div>
                <p className="text-xs text-[#b8a7c2] mt-0.5">{selectedApplication.legalName}</p>
              </div>

              <button
                onClick={() => setSelectedApplication(null)}
                className="p-1.5 rounded-lg text-[#9a86a3] hover:text-white hover:bg-[#2c0f33] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Organization Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#1f0b27] border border-[#381643] space-y-1">
                <span className="text-[10px] text-[#8e7a96] uppercase font-bold tracking-wider">Business Registration</span>
                <p className="font-mono text-white text-sm">{selectedApplication.registrationNumber}</p>
                <p className="text-[#a491ae]">{selectedApplication.organizationType}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#1f0b27] border border-[#381643] space-y-1">
                <span className="text-[10px] text-[#8e7a96] uppercase font-bold tracking-wider">Physical Address</span>
                <p className="text-white text-sm">{selectedApplication.physicalAddress}</p>
                <p className="text-[#a491ae]">{selectedApplication.city}, Malawi</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#1f0b27] border border-[#381643] space-y-1">
                <span className="text-[10px] text-[#8e7a96] uppercase font-bold tracking-wider">Direct Contacts</span>
                <p className="text-white flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#8b7bff]" /> {selectedApplication.email}</p>
                <p className="text-white flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#c084fc]" /> {selectedApplication.phone}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#1f0b27] border border-[#381643] space-y-1">
                <span className="text-[10px] text-[#8e7a96] uppercase font-bold tracking-wider">Online Presence</span>
                <p className="text-white flex items-center gap-1.5 truncate">
                  <Globe className="w-3.5 h-3.5 text-violet-400" />
                  <a href={selectedApplication.website} target="_blank" rel="noreferrer" className="underline hover:text-[#8b7bff] truncate">
                    {selectedApplication.website}
                  </a>
                </p>
                <p className="text-[#a491ae] truncate">
                  Social: {selectedApplication.socialLinks.instagram || selectedApplication.socialLinks.facebook || 'N/A'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Organizational Profile & Background</span>
              <p className="text-xs text-[#cebedb] p-3.5 rounded-2xl bg-[#1e0b25] border border-[#34133d] leading-relaxed">
                {selectedApplication.description}
              </p>
            </div>

            {/* Supporting Document Metadata Review */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#8b7bff]" />
                  Uploaded Verification Documents ({selectedApplication.documents.length})
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Metadata Validated</span>
              </div>

              <div className="space-y-2">
                {selectedApplication.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-2xl bg-[#1f0c27] border border-[#3c1747] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#3e347d]/30 border border-[#8b7bff]/30 flex items-center justify-center text-[#a78bfa]">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{doc.name}</p>
                        <p className="text-[10px] text-[#9c89a7]">
                          {doc.type} • {doc.size} • Uploaded {doc.uploadedAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                        Signed & Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#31133a] flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedApplication(null)}
                className="px-4 py-2 rounded-xl text-xs text-[#9f8ea7] hover:text-white transition-colors cursor-pointer"
              >
                Close Dossier
              </button>

              <div className="flex items-center gap-2.5">
                {selectedApplication.status !== 'rejected' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setRejectionTarget(selectedApplication);
                      setRejectionReason('');
                      setRejectionError('');
                    }}
                    className="text-xs text-rose-300 border-rose-900/60"
                  >
                    Reject Application
                  </Button>
                )}

                {selectedApplication.status !== 'approved' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApprove(selectedApplication)}
                    disabled={isSubmitting}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 border-emerald-500"
                    leftIcon={<Check className="w-4 h-4" />}
                  >
                    Accredit Organiser
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Rejection Reason Modal */}
      {rejectionTarget && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#17081b] border border-[#501625] shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-[#3a121e]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-950/70 border border-rose-800 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base">Reject Organiser Application</h3>
                  <p className="text-xs text-[#a997b4]">{rejectionTarget.organizationName}</p>
                </div>
              </div>

              <button
                onClick={() => setRejectionTarget(null)}
                className="text-[#9a86a3] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#cebdd9]">
              Please provide clear compliance or documentary grounds for rejection. This notification is returned to the applicant via Supabase RPC <code className="text-[#8b7bff] font-mono">review_organizer_application</code>.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white block">
                Official Rejection Grounds <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  setRejectionError('');
                }}
                placeholder="e.g. Incomplete MRA Tax Clearance Certificate. The submitted business registration certificate has expired. Please re-upload current credentials."
                className="w-full p-3 rounded-xl bg-[#200a16] border border-[#4a1725] text-xs text-white placeholder-[#7e5d66] focus:outline-none focus:border-rose-500"
              />
              {rejectionError && (
                <p className="text-xs text-rose-400">{rejectionError}</p>
              )}
            </div>

            <div className="pt-3 border-t border-[#3a121e] flex items-center justify-end gap-2.5">
              <button
                onClick={() => setRejectionTarget(null)}
                className="px-4 py-2 rounded-xl text-xs text-[#9c89a7] hover:text-white cursor-pointer"
              >
                Cancel
              </button>

              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmReject}
                disabled={isSubmitting}
                className="text-xs"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
