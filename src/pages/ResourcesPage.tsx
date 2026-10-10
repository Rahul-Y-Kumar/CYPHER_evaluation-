import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  FileText,
  FolderArchive,
  FileSpreadsheet
} from 'lucide-react';
import { NeoCard } from '../components/ui/NeoCard';
import { TechnicalLabel } from '../components/ui/TechnicalLabel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import type { NavigationTab } from '../types';

interface DatasetResource {
  id: string;
  psCode: string;
  shortTitle: string;
  problemTitle: string;
  title: string;
  folderName: string;
  category: string;
  size: string;
  files: string[];
  shortDesc: string;
  zipUrl: string;
}

const DATASETS: DatasetResource[] = [
  {
    id: 'DS-01',
    psCode: 'PS-01',
    shortTitle: 'Spare Parts',
    problemTitle: 'The Spare Parts Desk (Kaveri Spares & Hydraulics)',
    title: 'Spare Parts Compatibility, Multi-Variant OEM Catalog & Inventory Logs',
    folderName: '01_spare_parts',
    category: 'Supply Chain AI',
    size: '54 KB',
    files: [
      'inventory.csv',
      'products.csv',
      'purchase_orders.csv',
      'sales.csv',
      'suppliers.csv',
      'README.md'
    ],
    shortDesc: 'Spare parts inventory catalog, supplier lead times, multi-model compatibility matrices, sales history, and purchase orders.',
    zipUrl: '/Cypher4.0_dataset_kd/01_spare_parts.zip'
  },
  {
    id: 'DS-02',
    psCode: 'PS-02',
    shortTitle: 'Electronics Retail',
    problemTitle: 'The Festival Rush (VoltKart Electronics)',
    title: 'Festival Demand Spikes, Warehouse Stock Levels & Logistics Routing',
    folderName: '02_electronics_retail',
    category: 'Inventory Forecasting',
    size: '137 KB',
    files: [
      'inventory.csv',
      'products.csv',
      'promotions.csv',
      'purchase_orders.csv',
      'sales.csv',
      'suppliers.csv',
      'README.md'
    ],
    shortDesc: 'Multi-category electronics inventory, promotional campaign spikes, historical seasonal sales logs, and supplier SLAs.',
    zipUrl: '/Cypher4.0_dataset_kd/02_electronics_retail.zip'
  },
  {
    id: 'DS-03',
    psCode: 'PS-03',
    shortTitle: 'Fashion Inventory',
    problemTitle: 'The Wrong Sizes (BigFit Apparel)',
    title: 'Garment Fit Dimensions, Sizing Feedback & Return Pattern Telemetry',
    folderName: '03_fashion_inventory',
    category: 'Retail & Sizing AI',
    size: '76 KB',
    files: [
      'inventory.csv',
      'products.csv',
      'promotions.csv',
      'purchase_orders.csv',
      'sales.csv',
      'stores.csv',
      'suppliers.csv',
      'README.md'
    ],
    shortDesc: 'Apparel sizing dimensions, store-level inventory distributions, sales velocity, promotions, and return telemetry.',
    zipUrl: '/Cypher4.0_dataset_kd/03_fashion_inventory.zip'
  },
  {
    id: 'DS-04',
    psCode: 'PS-04',
    shortTitle: 'Franchise Operations',
    problemTitle: 'Head Office, 8:30 a.m. (FreshBasket Franchise Network)',
    title: 'Daily Perishable Supply Inflow, Store Demand & Expiry Risk Logs',
    folderName: '04_franchise_ops',
    category: 'Perishables Supply Chain',
    size: '269 KB',
    files: [
      'compliance.csv',
      'customers.csv',
      'inventory.csv',
      'products.csv',
      'purchase_orders.csv',
      'sales.csv',
      'staff.csv',
      'stores.csv',
      'wastage.csv',
      'README.md'
    ],
    shortDesc: 'Multi-store franchise operations, daily perishable wastage logs, compliance auditing, store staff rosters, and customer profiles.',
    zipUrl: '/Cypher4.0_dataset_kd/04_franchise_ops.zip'
  },
  {
    id: 'DS-05',
    psCode: 'PS-05',
    shortTitle: 'Hospital Operations',
    problemTitle: 'The Blocked Bed (Sanjeevani Multispeciality Hospital)',
    title: 'Hospital Bed Occupancy, Patient Discharge Trajectories & OR Schedules',
    folderName: '05_hospital_ops',
    category: 'Healthcare Logistics',
    size: '41 KB',
    files: [
      'admissions.csv',
      'appointments.csv',
      'beds.csv',
      'diagnostics.csv',
      'discharge.csv',
      'ed_wait_times.csv',
      'feedback.csv',
      'patients.csv',
      'staff.csv',
      'README.md'
    ],
    shortDesc: 'Hospital ward bed status, admissions, emergency wait times, diagnostic queues, patient feedback, and discharge turnaround telemetry.',
    zipUrl: '/Cypher4.0_dataset_kd/05_hospital_ops.zip'
  },
  {
    id: 'DS-06',
    psCode: 'PS-06',
    shortTitle: 'Dark Store & Quick Commerce',
    problemTitle: 'Before the Match Starts (Zipcart)',
    title: 'Match-Day Hyperlocal Order Surges, Dark Store Stocks & Rider Dispatch',
    folderName: '06_dark_store',
    category: 'Quick Commerce Surge',
    size: '93 KB',
    files: [
      'events.csv',
      'orders.csv',
      'products.csv',
      'riders.csv',
      'store_inventory.csv',
      'truck_schedule.csv',
      'warehouse_stock.csv',
      'README.md'
    ],
    shortDesc: 'Quick commerce micro-fulfillment dark store stock, delivery rider availability, match event schedules, and high-frequency orders.',
    zipUrl: '/Cypher4.0_dataset_kd/06_dark_store.zip'
  },
  {
    id: 'DS-07',
    psCode: 'PS-07',
    shortTitle: 'Pharma Distribution',
    problemTitle: 'Batch B2231 (Arogya Pharma Distributors)',
    title: 'Pharmaceutical Batch Tracking, Cold-Chain Temperature & Recall Tracing',
    folderName: '07_pharma_distribution',
    category: 'Pharma Traceability',
    size: '47 KB',
    files: [
      'batch_inventory.csv',
      'customers.csv',
      'dispatches.csv',
      'products.csv',
      'purchase_orders.csv',
      'recalls.csv',
      'suppliers.csv',
      'temperature_logs.csv',
      'README.md'
    ],
    shortDesc: 'Pharmaceutical batch genealogy, IoT cold-chain temperature telemetry logs, recall notices, dispatch logs, and regulatory compliance.',
    zipUrl: '/Cypher4.0_dataset_kd/07_pharma_distribution.zip'
  },
  {
    id: 'DS-08',
    psCode: 'PS-08',
    shortTitle: 'Transport Control Tower',
    problemTitle: 'The Truck Near Hubli (Sudha Home Products)',
    title: 'Freight Telematics, Breakdown Alerts & Dynamic Transshipment Routes',
    folderName: '08_transport_control_tower',
    category: 'Fleet Transit & Logistics',
    size: '13 KB',
    files: [
      'carriers.csv',
      'commitments.csv',
      'depot_inventory.csv',
      'lanes.csv',
      'plant_stock.csv',
      'products.csv',
      'shipments.csv',
      'shipment_status.csv',
      'README.md'
    ],
    shortDesc: 'Inter-city freight telemetry, transit lane commitments, depot stocks, breakdown alerts, and carrier SLA ratings.',
    zipUrl: '/Cypher4.0_dataset_kd/08_transport_control_tower.zip'
  },
  {
    id: 'DS-09',
    psCode: 'PS-09',
    shortTitle: 'Manufacturing Shortage',
    problemTitle: 'One Missing Part (Precision Axle Components)',
    title: 'Assembly Line BOM Deficit, Machine Downtime & Dynamic Substitution',
    folderName: '09_manufacturing_shortage',
    category: 'Manufacturing BOM AI',
    size: '5 KB',
    files: [
      'bom.csv',
      'components.csv',
      'customer_orders.csv',
      'products.csv',
      'purchase_orders.csv',
      'schedule.csv',
      'substitutes.csv',
      'suppliers.csv',
      'README.md'
    ],
    shortDesc: 'Manufacturing Bill of Materials (BOM), line assembly schedules, component substitute matrices, and supplier shortage logs.',
    zipUrl: '/Cypher4.0_dataset_kd/09_manufacturing_shortage.zip'
  },
  {
    id: 'DS-10',
    psCode: 'PS-10',
    shortTitle: 'Reverse Logistics',
    problemTitle: 'What Came Back (Gadgetbay)',
    title: 'Reverse Logistics, E-Commerce Return Diagnostics & Grade Assessment',
    folderName: '10_returns_reverse_logistics',
    category: 'Reverse Logistics AI',
    size: '42 KB',
    files: [
      'inventory.csv',
      'liquidation.csv',
      'products.csv',
      'refurbishment.csv',
      'returns.csv',
      'sales.csv',
      'vendor_terms.csv',
      'README.md'
    ],
    shortDesc: 'E-commerce reverse logistics return triage, cosmetic and functional inspection scores, liquidation routing, and vendor recovery terms.',
    zipUrl: '/Cypher4.0_dataset_kd/10_returns_reverse_logistics.zip'
  },
  {
    id: 'DS-11',
    psCode: 'PS-11',
    shortTitle: 'Supplier Risk & Procurement',
    problemTitle: 'Three Small Warnings (Malnad Industrial Pumps)',
    title: 'Industrial Pump Vibration, Pressure Gradient & Failure Prognostics',
    folderName: '11_procurement_supplier_risk',
    category: 'Procurement & Risk AI',
    size: '120 KB',
    files: [
      'compliance_docs.csv',
      'contracts.csv',
      'inspections.csv',
      'item_demand.csv',
      'items.csv',
      'purchase_orders.csv',
      'suppliers.csv',
      'README.md'
    ],
    shortDesc: 'Supplier risk audits, inspection scoring logs, contract SLA commitments, compliance certifications, and critical item demand trends.',
    zipUrl: '/Cypher4.0_dataset_kd/11_procurement_supplier_risk.zip'
  },
];

interface ResourcesPageProps {
  onSelectTab: (tab: NavigationTab) => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ onSelectTab }) => {
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const tracks = ['ALL', 'PS-01', 'PS-02', 'PS-03', 'PS-04', 'PS-05', 'PS-06', 'PS-07', 'PS-08', 'PS-09', 'PS-10', 'PS-11'];

  const filteredDatasets = DATASETS.filter((ds) => {
    const matchesTrack = selectedTrackFilter === 'ALL' || ds.psCode === selectedTrackFilter;
    const matchesSearch =
      ds.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.shortTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.psCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.problemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.files.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTrack && matchesSearch;
  });

  const handleDownloadDatasetZip = (ds: DatasetResource) => {
    const link = document.createElement('a');
    link.href = ds.zipUrl;
    link.download = `${ds.folderName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSingleFile = (folderName: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = `/Cypher4.0_dataset_kd/${folderName}/${fileName}`;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAllBundle = () => {
    const link = document.createElement('a');
    link.href = '/Cypher4.0_dataset_kd/Cypher4.0_all_datasets_kd.zip';
    link.download = 'Cypher4.0_all_datasets_kd.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ position: 'relative', zIndex: 1, paddingTop: '3rem', paddingBottom: '6rem' }}>
      <div className="container-custom">
        {/* Header Terminal Info */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
            <TechnicalLabel color="cyan" variant="bracket">
              03 // PROBLEM STATEMENT DATASETS
            </TechnicalLabel>
            <StatusBadge status="OFFICIAL KD'S GARAGE DATASETS" variant="acid" />
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem' }}>
            <div>
              <h1 className="display-hero" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--white)', marginBottom: '0.75rem', marginTop: '0.35rem' }}>
                RESOURCES & <span style={{ color: 'var(--acid)' }}>DATASETS</span>
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: '720px', lineHeight: '1.6' }}>
                Official KD's Garage datasets for challenges <strong>PS-01 through PS-11</strong>. Download the complete dataset bundle (.zip) for each problem statement, or inspect and download individual CSV data files.
              </p>
            </div>

            {/* Download All Datasets Master Bundle */}
            <Button
              variant="primary"
              size="md"
              rollText={true}
              arrow={true}
              icon={<FolderArchive size={16} />}
              onClick={handleDownloadAllBundle}
              style={{ alignSelf: 'center' }}
            >
              DOWNLOAD ALL DATASETS (.ZIP) ↗
            </Button>
          </div>
        </div>

        {/* Filters & Search Control Bar */}
        <NeoCard
          variant="default"
          style={{
            padding: '1.25rem',
            backgroundColor: 'var(--ink)',
            marginBottom: '2.5rem',
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <Search
              size={18}
              color="var(--muted)"
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search datasets by PS code (PS-01), topic (Spare Parts), file name (inventory.csv)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem 0.8rem 2.8rem',
                background: 'var(--paper)',
                border: '2px solid var(--line)',
                color: 'var(--white)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Problem Statement Filter Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center' }}>
            <TechnicalLabel color="muted" style={{ marginRight: '0.5rem' }}>
              FILTER BY PROBLEM:
            </TechnicalLabel>
            {tracks.map((track) => {
              const isSelected = selectedTrackFilter === track;
              return (
                <button
                  key={track}
                  onClick={() => setSelectedTrackFilter(track)}
                  style={{
                    background: isSelected ? 'var(--acid)' : 'var(--paper)',
                    color: isSelected ? 'var(--ink)' : 'var(--white)',
                    border: isSelected ? '2px solid var(--ink)' : '1px solid var(--line)',
                    padding: '0.4rem 0.75rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: isSelected ? '2px 2px 0 var(--ink)' : 'none',
                    transition: 'all 0.1s ease',
                  }}
                >
                  {track}
                </button>
              );
            })}
          </div>
        </NeoCard>

        {/* Datasets Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(370px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {filteredDatasets.map((ds) => (
            <NeoCard
              key={ds.id}
              variant="default"
              hoverEffect={true}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.75rem',
                border: '2px solid var(--line)',
              }}
            >
              <div>
                {/* Header Tag Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
                  <StatusBadge status={ds.psCode} variant="acid" />

                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--acid)',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      padding: '0.25rem 0.65rem',
                      background: 'rgba(234, 255, 0, 0.08)',
                      border: '1px solid var(--line)',
                    }}
                  >
                    {ds.shortTitle}
                  </span>
                </div>

                {/* Problem Statement Reference */}
                <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '0.4rem' }}>
                  CHALLENGE: {ds.problemTitle}
                </div>

                {/* Dataset Title */}
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--white)', marginBottom: '0.75rem', lineHeight: 1.35 }}>
                  {ds.title}
                </h3>

                <p style={{ color: 'var(--muted)', fontSize: '0.82rem', lineHeight: '1.55', marginBottom: '1.25rem' }}>
                  {ds.shortDesc}
                </p>

                {/* Files Attached in this Dataset */}
                <div style={{ marginBottom: '1.25rem', background: 'var(--ink)', padding: '0.9rem', border: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                    <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--acid)', fontWeight: 700, letterSpacing: '0.05em' }}>
                      INCLUDED DATASET FILES ({ds.files.length}):
                    </span>
                    <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>
                      {ds.size}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {ds.files.map((file) => (
                      <button
                        key={file}
                        onClick={() => handleDownloadSingleFile(ds.folderName, file)}
                        title={`Click to download ${file}`}
                        style={{
                          background: 'var(--paper)',
                          border: '1px solid var(--line)',
                          color: file.endsWith('.csv') ? 'var(--cyan)' : 'var(--white)',
                          padding: '0.25rem 0.5rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.1s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--acid)';
                          e.currentTarget.style.color = 'var(--acid)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--line)';
                          e.currentTarget.style.color = file.endsWith('.csv') ? 'var(--cyan)' : 'var(--white)';
                        }}
                      >
                        {file.endsWith('.csv') ? <FileSpreadsheet size={11} /> : <FileText size={11} />}
                        <span>{file}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button: DOWNLOAD DATASET */}
              <div
                style={{
                  borderTop: '1px solid var(--line)',
                  paddingTop: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => handleDownloadDatasetZip(ds)}
                  icon={<Download size={15} />}
                >
                  DOWNLOAD DATASET
                </Button>
              </div>
            </NeoCard>
          ))}
        </div>
      </div>
    </div>
  );
};
