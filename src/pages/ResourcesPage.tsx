import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Database, 
  FileText,
  Layers,
  Sparkles
} from 'lucide-react';
import { NeoCard } from '../components/ui/NeoCard';
import { TechnicalLabel } from '../components/ui/TechnicalLabel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import type { NavigationTab } from '../types';

interface DatasetResource {
  id: string;
  psCode: string;
  problemTitle: string;
  title: string;
  category: string;
  format: string;
  size: string;
  shortDesc: string;
  downloadFileName: string;
  sampleColumns: string[];
  sampleData: Record<string, string | number>[];
}

const DATASETS: DatasetResource[] = [
  {
    id: 'DS-01',
    psCode: 'PS-01',
    problemTitle: 'Autonomous Multi-Agent Threat Neutralization Engine',
    title: 'Linux Kernel Syscall & Network Packet Anomaly Dataset',
    category: 'CyberSecurity',
    format: '.CSV',
    size: '142 MB',
    shortDesc: 'Over 250,000 labeled kernel syscall events, zero-day memory corruption patterns, and raw network PCAP flows.',
    downloadFileName: 'CYPHER4_PS01_KERNEL_ANOMALY_DATASET.csv',
    sampleColumns: ['timestamp_ns', 'pid', 'syscall_id', 'process_name', 'cpu_core', 'ring_buf_latency_us', 'is_anomalous', 'threat_label'],
    sampleData: [
      { timestamp_ns: 1728394001234, pid: 4108, syscall_id: 59, process_name: 'containerd-shim', cpu_core: 3, ring_buf_latency_us: 1.2, is_anomalous: 0, threat_label: 'BENIGN' },
      { timestamp_ns: 1728394002450, pid: 8821, syscall_id: 101, process_name: 'mem_injector', cpu_core: 1, ring_buf_latency_us: 4.8, is_anomalous: 1, threat_label: 'ZERO_DAY_INJECTION' },
      { timestamp_ns: 1728394003890, pid: 9104, syscall_id: 157, process_name: 'ebpf_probe_hook', cpu_core: 7, ring_buf_latency_us: 0.9, is_anomalous: 0, threat_label: 'BENIGN' },
      { timestamp_ns: 1728394005110, pid: 1204, syscall_id: 62, process_name: 'priv_esc_exploit', cpu_core: 2, ring_buf_latency_us: 14.5, is_anomalous: 1, threat_label: 'PRIVILEGE_ESCALATION' }
    ],
  },
  {
    id: 'DS-02',
    psCode: 'PS-02',
    problemTitle: 'Zero-Knowledge Privacy-Preserving Algorithmic Settlement Layer',
    title: 'High-Frequency L2 Orderbook Ticks & Merkle State Roots',
    category: 'FinTech',
    format: '.CSV',
    size: '88 MB',
    shortDesc: '1,000,000 orderbook state transitions with recursive zero-knowledge cryptographic proof benchmarks.',
    downloadFileName: 'CYPHER4_PS02_L2_ORDERBOOK_MERKLE.csv',
    sampleColumns: ['tick_id', 'asset_pair', 'bid_price', 'ask_price', 'batch_size', 'merkle_root_hex', 'zk_proof_time_ms', 'gas_used'],
    sampleData: [
      { tick_id: 10041, asset_pair: 'ETH/USDC', bid_price: 2640.50, ask_price: 2640.55, batch_size: 64, merkle_root_hex: '0x3a8fb12c', zk_proof_time_ms: 42.1, gas_used: 184500 },
      { tick_id: 10042, asset_pair: 'ETH/USDC', bid_price: 2640.52, ask_price: 2640.56, batch_size: 128, merkle_root_hex: '0x99e177d4', zk_proof_time_ms: 78.4, gas_used: 245000 },
      { tick_id: 10043, asset_pair: 'BTC/USDC', bid_price: 64200.0, ask_price: 64201.5, batch_size: 32, merkle_root_hex: '0x12ca90fa', zk_proof_time_ms: 28.9, gas_used: 128900 }
    ],
  },
  {
    id: 'DS-03',
    psCode: 'PS-03',
    problemTitle: 'Self-Healing Distributed Knowledge Graph for Medical Diagnostics',
    title: 'PubMed Biomedical Graph Nodes & Clinical Trial Embeddings',
    category: 'AI/ML',
    format: '.CSV',
    size: '115 MB',
    shortDesc: 'Corpus of 50,000 biomedical entities, conflict resolution weights, and citation confidence ground truth.',
    downloadFileName: 'CYPHER4_PS03_BIOMEDICAL_KNOWLEDGE_GRAPH.csv',
    sampleColumns: ['entity_id', 'mesh_heading', 'paper_doi', 'confidence_score', 'contradiction_flag', 'embedding_dim_768'],
    sampleData: [
      { entity_id: 'BIO_9021', mesh_heading: 'Myocardial Infarction', paper_doi: '10.1016/s0140', confidence_score: 0.96, contradiction_flag: 0, embedding_dim_768: '[0.012,-0.045,0.089...]' },
      { entity_id: 'BIO_9022', mesh_heading: 'Troponin-T Elevation', paper_doi: '10.1056/nejm1997', confidence_score: 0.99, contradiction_flag: 0, embedding_dim_768: '[0.041,-0.012,0.114...]' }
    ],
  },
  {
    id: 'DS-04',
    psCode: 'PS-04',
    problemTitle: 'Cross-Chain Decentralized AI Model Co-Execution Network',
    title: 'Heterogeneous GPU Worker Tensor Benchmarks & Slashing Logs',
    category: 'Web3/Crypto',
    format: '.CSV',
    size: '76 MB',
    shortDesc: 'Distributed inference layer proofs, GPU latency statistics, and cryptographic validator challenges.',
    downloadFileName: 'CYPHER4_PS04_GPU_CO_EXECUTION_VERIFICATION.csv',
    sampleColumns: ['task_id', 'worker_node_id', 'gpu_model', 'tensor_digest_sha', 'challenge_status', 'slash_amount_eth'],
    sampleData: [
      { task_id: 'TASK_771', worker_node_id: 'NODE_RTX4090_01', gpu_model: 'RTX 4090 24GB', tensor_digest_sha: '0x8f19da...', challenge_status: 'VERIFIED_VALID', slash_amount_eth: 0.0 },
      { task_id: 'TASK_772', worker_node_id: 'NODE_A100_08', gpu_model: 'A100 80GB SXM', tensor_digest_sha: '0x2c4a91...', challenge_status: 'VERIFIED_VALID', slash_amount_eth: 0.0 }
    ],
  },
  {
    id: 'DS-05',
    psCode: 'PS-05',
    problemTitle: 'Automated Telematics Telemetry & Predictive Fleet Diagnostic Engine',
    title: 'High-Frequency OBD-II CAN Telematics & Engine Sensor Timeseries',
    category: 'Automotive / IoT',
    format: '.CSV',
    size: '160 MB',
    shortDesc: '500,000 real-world commercial fleet OBD-II stream records including RPM, coolant temperature, fuel trim, and fault codes.',
    downloadFileName: 'CYPHER4_PS05_FLEET_TELEMATICS_TELEMETRY.csv',
    sampleColumns: ['timestamp_ms', 'vehicle_vin', 'rpm', 'coolant_temp_c', 'fuel_trim_pct', 'brake_pressure_bar', 'dtc_fault_code'],
    sampleData: [
      { timestamp_ms: 1728394010000, vehicle_vin: '1HGCR2F8XHA012', rpm: 2150, coolant_temp_c: 89.2, fuel_trim_pct: 2.1, brake_pressure_bar: 0.0, dtc_fault_code: 'P0000' },
      { timestamp_ms: 1728394011000, vehicle_vin: '1HGCR2F8XHA012', rpm: 3400, coolant_temp_c: 98.6, fuel_trim_pct: 12.4, brake_pressure_bar: 18.5, dtc_fault_code: 'P0171_LEAN' },
      { timestamp_ms: 1728394012000, vehicle_vin: '1HGCR2F8XHA014', rpm: 1800, coolant_temp_c: 88.0, fuel_trim_pct: -0.8, brake_pressure_bar: 0.0, dtc_fault_code: 'P0000' }
    ],
  },
  {
    id: 'DS-06',
    psCode: 'PS-06',
    problemTitle: 'Real-Time ECU Firmware Anomaly Detection & CAN-Bus Intrusion Prevention',
    title: 'Raw Automotive CAN-Bus Arbitration Frames & Injection Traces',
    category: 'Automotive / CyberSecurity',
    format: '.CSV',
    size: '95 MB',
    shortDesc: 'Over 1,200,000 parsed CAN-bus broadcast messages containing synthetic replay attacks, fuzzing pulses, and benign traffic.',
    downloadFileName: 'CYPHER4_PS06_CANBUS_ECU_ANOMALY_LOGS.csv',
    sampleColumns: ['time_offset_us', 'can_id_hex', 'dlc', 'payload_hex', 'inter_packet_gap_us', 'is_injection_attack'],
    sampleData: [
      { time_offset_us: 104, can_id_hex: '0x1F0', dlc: 8, payload_hex: '00 12 4F 88 00 00 00 10', inter_packet_gap_us: 1000, is_injection_attack: 0 },
      { time_offset_us: 208, can_id_hex: '0x000', dlc: 8, payload_hex: 'FF FF FF FF FF FF FF FF', inter_packet_gap_us: 12, is_injection_attack: 1 },
      { time_offset_us: 312, can_id_hex: '0x280', dlc: 8, payload_hex: '01 A2 33 00 00 18 20 04', inter_packet_gap_us: 1000, is_injection_attack: 0 }
    ],
  },
  {
    id: 'DS-07',
    psCode: 'PS-07',
    problemTitle: 'Intelligent Battery Management & Thermal Runaway Early Warning System',
    title: 'EV Multi-Cell Li-Ion Thermal Gradient & Electrochemical Impedance Corpus',
    category: 'EV / CleanTech',
    format: '.CSV',
    size: '130 MB',
    shortDesc: 'Multi-channel voltage, current, and thermal sensor readings capturing normal charging, over-discharge, and micro-short thermal runaway.',
    downloadFileName: 'CYPHER4_PS07_EV_BATTERY_THERMAL_CELL_METRICS.csv',
    sampleColumns: ['step_id', 'pack_id', 'cell_index', 'voltage_mv', 'current_a', 'surface_temp_c', 'internal_res_mohm', 'runaway_risk_score'],
    sampleData: [
      { step_id: 1001, pack_id: 'NMC_PACK_60KWH', cell_index: 4, voltage_mv: 4180, current_a: 45.0, surface_temp_c: 32.4, internal_res_mohm: 1.2, runaway_risk_score: 0.02 },
      { step_id: 1002, pack_id: 'NMC_PACK_60KWH', cell_index: 4, voltage_mv: 3920, current_a: 45.0, surface_temp_c: 54.8, internal_res_mohm: 4.8, runaway_risk_score: 0.89 }
    ],
  },
  {
    id: 'DS-08',
    psCode: 'PS-08',
    problemTitle: 'Vision-Based ADAS Driver Drowsiness & Blind-Spot Detection',
    title: 'In-Cabin Driver Facial Landmarks & Blind-Spot Proximity Telemetry',
    category: 'Automotive / Computer Vision',
    format: '.CSV',
    size: '210 MB',
    shortDesc: 'PERCLOS eye aspect ratios, head pitch/yaw/roll coordinates, and radar distance metrics for driver safety systems.',
    downloadFileName: 'CYPHER4_PS08_ADAS_DRIVER_TELEMETRY_VISION.csv',
    sampleColumns: ['frame_index', 'eye_aspect_ratio', 'mouth_aspect_ratio', 'head_yaw_deg', 'head_pitch_deg', 'drowsiness_state'],
    sampleData: [
      { frame_index: 301, eye_aspect_ratio: 0.32, mouth_aspect_ratio: 0.15, head_yaw_deg: -2.1, head_pitch_deg: 0.5, drowsiness_state: 'ALERT' },
      { frame_index: 302, eye_aspect_ratio: 0.14, mouth_aspect_ratio: 0.62, head_yaw_deg: -8.4, head_pitch_deg: -18.2, drowsiness_state: 'MICRO_SLEEP_YAWN' }
    ],
  },
  {
    id: 'DS-09',
    psCode: 'PS-09',
    problemTitle: 'Autonomous Robotic Warehouse AGV Route Optimization & Collision Avoidance',
    title: '50-Agent Warehouse Grid Spatial Coordinates & Obstacle Conflict Maps',
    category: 'Robotics / Autonomous Systems',
    format: '.CSV',
    size: '68 MB',
    shortDesc: 'Time-space waypoint sequences, dynamic obstruction events, and pick-up node routing benchmarks for automated guided vehicles.',
    downloadFileName: 'CYPHER4_PS09_AGV_WAREHOUSE_SPATIAL_COORDINATES.csv',
    sampleColumns: ['timestep_s', 'agv_id', 'grid_x', 'grid_y', 'target_bay_id', 'velocity_mps', 'conflict_detected'],
    sampleData: [
      { timestep_s: 12.5, agv_id: 'AGV_ALPHA_01', grid_x: 14, grid_y: 28, target_bay_id: 'BAY_D09', velocity_mps: 1.8, conflict_detected: 0 },
      { timestep_s: 12.5, agv_id: 'AGV_ALPHA_04', grid_x: 14, grid_y: 29, target_bay_id: 'BAY_B02', velocity_mps: 0.0, conflict_detected: 1 }
    ],
  },
  {
    id: 'DS-10',
    psCode: 'PS-10',
    problemTitle: 'Low-Latency Edge AI Audio Engine for Engine Fault Acoustic Profiling',
    title: 'Powertrain Mel-Spectrogram Bins & Acoustic Vibration Frequencies',
    category: 'Edge AI / DSP',
    format: '.CSV',
    size: '185 MB',
    shortDesc: '128-band mel-frequency spectral coefficients captured from healthy engines vs piston slap, bearing wear, and loose timing chains.',
    downloadFileName: 'CYPHER4_PS10_ENGINE_ACOUSTIC_FREQUENCY_SPECTRA.csv',
    sampleColumns: ['sample_id', 'engine_model', 'rpm_band', 'peak_freq_hz', 'snr_db', 'spectral_centroid_hz', 'anomaly_class'],
    sampleData: [
      { sample_id: 'AUDIO_501', engine_model: '4-CYL_TURBO_2.0L', rpm_band: '2000-2500', peak_freq_hz: 480, snr_db: 18.2, spectral_centroid_hz: 1240, anomaly_class: 'NORMAL_OPERATION' },
      { sample_id: 'AUDIO_502', engine_model: '4-CYL_TURBO_2.0L', rpm_band: '2000-2500', peak_freq_hz: 1840, snr_db: 8.4, spectral_centroid_hz: 3410, anomaly_class: 'ROD_KNOCK_ANOMALY' }
    ],
  },
  {
    id: 'DS-11',
    psCode: 'PS-11',
    problemTitle: 'Dynamic EV Charging Grid Load Balancer & V2G Energy Arbitrage Ledger',
    title: 'Multi-Port Commercial EV Charging Hub Substation Telemetry & Spot Tariffs',
    category: 'EV / Smart Grid',
    format: '.CSV',
    size: '54 MB',
    shortDesc: 'Transformer load profiles, dynamic V2G feed-in tariff curves, and simultaneous 16-port DC fast-charging utilization logs.',
    downloadFileName: 'CYPHER4_PS11_EV_CHARGING_GRID_LOAD_ARBITRAGE.csv',
    sampleColumns: ['time_slot_min', 'hub_id', 'transformer_kw_load', 'active_dispensers', 'grid_frequency_hz', 'spot_tariff_inr', 'v2g_discharge_kw'],
    sampleData: [
      { time_slot_min: 720, hub_id: 'HUB_HEBBAL_01', transformer_kw_load: 420.5, active_dispensers: 12, grid_frequency_hz: 50.02, spot_tariff_inr: 6.40, v2g_discharge_kw: 0.0 },
      { time_slot_min: 721, hub_id: 'HUB_HEBBAL_01', transformer_kw_load: 580.0, active_dispensers: 16, grid_frequency_hz: 49.88, spot_tariff_inr: 9.80, v2g_discharge_kw: 120.0 }
    ],
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
      ds.psCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.problemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ds.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTrack && matchesSearch;
  });

  const handleDownloadCSV = (ds: DatasetResource) => {
    const header = ds.sampleColumns.join(',');
    const rows = ds.sampleData.map((row) => ds.sampleColumns.map((col) => row[col]).join(','));
    const content = [header, ...rows].join('\n');

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = ds.downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            <StatusBadge status="OFFICIAL DATASETS" variant="acid" />
          </div>
          <h1 className="display-hero" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--white)', marginBottom: '0.75rem', marginTop: '0.35rem' }}>
            RESOURCES & <span style={{ color: 'var(--acid)' }}>DATASETS</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: '720px', lineHeight: '1.6' }}>
            Download datasets and test files for each problem statement to build, test, and validate your hackathon solutions.
          </p>
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
              placeholder="Search datasets by PS code (PS-01), domain, title, keywords..."
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <StatusBadge status={ds.psCode} variant="acid" />
                    <span
                      className="font-mono"
                      style={{
                        padding: '0.2rem 0.5rem',
                        background: 'var(--ink)',
                        color: 'var(--cyan)',
                        border: '1px solid var(--line)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}
                    >
                      {ds.format}
                    </span>
                  </div>

                  <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--white)', fontWeight: 800 }}>
                    {ds.size}
                  </span>
                </div>

                {/* Problem Statement Reference */}
                <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--muted)', marginBottom: '0.4rem' }}>
                  CHALLENGE: {ds.problemTitle}
                </div>

                {/* Dataset Title */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--white)', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                  {ds.title}
                </h3>

                <p style={{ color: 'var(--muted)', fontSize: '0.82rem', lineHeight: '1.55', marginBottom: '1.25rem' }}>
                  {ds.shortDesc}
                </p>
              </div>

              {/* Single Download .CSV Button */}
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
                  onClick={() => handleDownloadCSV(ds)}
                  icon={<Download size={15} />}
                >
                  DOWNLOAD .CSV
                </Button>
              </div>
            </NeoCard>
          ))}
        </div>
      </div>
    </div>
  );
};
