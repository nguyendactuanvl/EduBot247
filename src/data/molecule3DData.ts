/**
 * 3D Molecule Data & Coordinates for Interactive WebGL/Three.js Simulation
 * Contains atomic coordinates (x, y, z in Angstroms), bond types, CPK colors,
 * hybridization, bond angles, polarity, and educational chemistry insights.
 */

export interface Atom3D {
  id: string;
  symbol: string;         // H, C, O, N, Na, Cl, S, Ca, Fe, Cu, etc.
  nameVi: string;
  x: number;              // Position x in Angstroms
  y: number;              // Position y
  z: number;              // Position z
  radiusCPK: number;      // Relative CPK sphere radius (e.g., 0.35 for H, 0.70 for C, 0.60 for O)
  colorCPK: number;       // Hex color for Three.js material
  oxidationState?: string;
}

export interface Bond3D {
  from: string;           // Atom ID
  to: string;             // Atom ID
  type: 'single' | 'double' | 'triple' | 'ionic' | 'resonance';
  order: number;          // 1, 2, 3
}

export interface Molecule3D {
  id: string;
  formula: string;              // H2O, CO2, CH4, NH3, NaCl, C2H5OH, C6H6, H2SO4...
  formulaLatex: string;         // $H_2O$, $CO_2$, $CH_4$...
  nameIupac: string;
  nameVi: string;
  molarMass: number;            // g/mol
  categoryVi: 'Oxit' | 'Axit' | 'Bazơ' | 'Muối' | 'Hợp chất hữu cơ' | 'Đơn chất' | 'Khí hiếm';
  shapeNameVi: string;          // Dạng hình học phân tử
  bondAngleVi: string;          // Góc liên kết (ví dụ: $104{,}5^\circ$)
  hybridization: string;        // $sp$, $sp^2$, $sp^3$, v.v.
  polarityVi: string;           // Phân tử có cực / Không cực
  descriptionVi: string;        // Giải thích chi tiết theo SGK GDPT 2018
  atoms: Atom3D[];
  bonds: Bond3D[];
}

// CPK Color Map & Default Radii
export const CPK_ELEMENT_SPECS: Record<string, { color: number; radius: number; nameVi: string }> = {
  H:  { color: 0xF8FAFC, radius: 0.35, nameVi: 'Hydrogen' },
  C:  { color: 0x334155, radius: 0.68, nameVi: 'Carbon' },
  N:  { color: 0x3B82F6, radius: 0.65, nameVi: 'Nitrogen' },
  O:  { color: 0xEF4444, radius: 0.60, nameVi: 'Oxygen' },
  F:  { color: 0x22C55E, radius: 0.55, nameVi: 'Fluorine' },
  Na: { color: 0x8B5CF6, radius: 0.95, nameVi: 'Sodium' },
  Mg: { color: 0x10B981, radius: 0.85, nameVi: 'Magnesium' },
  Al: { color: 0x64748B, radius: 0.80, nameVi: 'Aluminum' },
  Si: { color: 0xF59E0B, radius: 0.85, nameVi: 'Silicon' },
  P:  { color: 0xF97316, radius: 0.75, nameVi: 'Phosphorus' },
  S:  { color: 0xEAB308, radius: 0.80, nameVi: 'Sulfur' },
  Cl: { color: 0x10B981, radius: 0.75, nameVi: 'Chlorine' },
  K:  { color: 0xA855F7, radius: 1.05, nameVi: 'Potassium' },
  Ca: { color: 0x94A3B8, radius: 0.98, nameVi: 'Calcium' },
  Fe: { color: 0xB45309, radius: 0.88, nameVi: 'Iron' },
  Cu: { color: 0xD97706, radius: 0.85, nameVi: 'Copper' },
  Zn: { color: 0x0EA5E9, radius: 0.82, nameVi: 'Zinc' },
  Br: { color: 0x991B1B, radius: 0.85, nameVi: 'Bromine' },
  I:  { color: 0x581C87, radius: 0.98, nameVi: 'Iodine' },
  Ba: { color: 0x059669, radius: 1.10, nameVi: 'Barium' },
};

export const MOLECULES_3D_DATABASE: Molecule3D[] = [
  {
    id: 'h2o',
    formula: 'H2O',
    formulaLatex: '$H_2O$',
    nameIupac: 'Water / Dihydrogen monoxide',
    nameVi: 'Nước',
    molarMass: 18.015,
    categoryVi: 'Oxit',
    shapeNameVi: 'Góc (Bent / V-shaped)',
    bondAngleVi: '$104{,}5^\\circ$',
    hybridization: '$sp^3$',
    polarityVi: 'Phân tử có cực mạnh',
    descriptionVi: 'Phân tử nước có cấu tạo góc $104{,}5^\\circ$ do nguyên tử $O$ ở trạng thái lai hóa $sp^3$ còn $2$ cặp electron tự do đẩy mạnh các liên kết $O-H$. Giữa các phân tử $H_2O$ hình thành liên kết hydrogen bền vững.',
    atoms: [
      { id: 'O1', symbol: 'O', nameVi: 'Oxygen', x: 0, y: 0, z: 0, radiusCPK: 0.62, colorCPK: 0xEF4444, oxidationState: '-2' },
      { id: 'H1', symbol: 'H', nameVi: 'Hydrogen', x: 0.96, y: 0, z: 0, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
      { id: 'H2', symbol: 'H', nameVi: 'Hydrogen', x: -0.24, y: 0.93, z: 0, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
    ],
    bonds: [
      { from: 'O1', to: 'H1', type: 'single', order: 1 },
      { from: 'O1', to: 'H2', type: 'single', order: 1 }
    ]
  },
  {
    id: 'co2',
    formula: 'CO2',
    formulaLatex: '$CO_2$',
    nameIupac: 'Carbon dioxide',
    nameVi: 'Khí Cacbonic',
    molarMass: 44.01,
    categoryVi: 'Oxit',
    shapeNameVi: 'Đường thẳng (Linear)',
    bondAngleVi: '$180^\\circ$',
    hybridization: '$sp$',
    polarityVi: 'Phân tử không cực (mômen động cực triệt tiêu)',
    descriptionVi: 'Nguyên tử $C$ lai hóa $sp$ tạo $2$ liên kết đôi $\\sigma$ và $\\pi$ với $2$ nguyên tử $O$, góc liên kết $O=C=O$ bằng $180^\\circ$. Mặc dù liên kết $C=O$ có cực nhưng do phân tử đối xứng thẳng nên tổng cực từ triệt tiêu.',
    atoms: [
      { id: 'C1', symbol: 'C', nameVi: 'Carbon', x: 0, y: 0, z: 0, radiusCPK: 0.68, colorCPK: 0x334155, oxidationState: '+4' },
      { id: 'O1', symbol: 'O', nameVi: 'Oxygen', x: 1.16, y: 0, z: 0, radiusCPK: 0.60, colorCPK: 0xEF4444, oxidationState: '-2' },
      { id: 'O2', symbol: 'O', nameVi: 'Oxygen', x: -1.16, y: 0, z: 0, radiusCPK: 0.60, colorCPK: 0xEF4444, oxidationState: '-2' },
    ],
    bonds: [
      { from: 'C1', to: 'O1', type: 'double', order: 2 },
      { from: 'C1', to: 'O2', type: 'double', order: 2 }
    ]
  },
  {
    id: 'ch4',
    formula: 'CH4',
    formulaLatex: '$CH_4$',
    nameIupac: 'Methane',
    nameVi: 'Khí Metan',
    molarMass: 16.04,
    categoryVi: 'Hợp chất hữu cơ',
    shapeNameVi: 'Tứ diện đều (Tetrahedral)',
    bondAngleVi: '$109{,}5^\\circ$',
    hybridization: '$sp^3$',
    polarityVi: 'Phân tử không cực',
    descriptionVi: 'Ankan đơn giản nhất. Nguyên tử $C$ ở tâm tứ diện lai hóa $sp^3$, hướng về $4$ đỉnh tứ diện đều chứa $4$ nguyên tử $H$. Các góc liên kết $H-C-H$ đều bằng $109{,}5^\\circ$.',
    atoms: [
      { id: 'C1', symbol: 'C', nameVi: 'Carbon', x: 0, y: 0, z: 0, radiusCPK: 0.68, colorCPK: 0x334155, oxidationState: '-4' },
      { id: 'H1', symbol: 'H', nameVi: 'Hydrogen', x: 0.63, y: 0.63, z: 0.63, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
      { id: 'H2', symbol: 'H', nameVi: 'Hydrogen', x: -0.63, y: -0.63, z: 0.63, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
      { id: 'H3', symbol: 'H', nameVi: 'Hydrogen', x: -0.63, y: 0.63, z: -0.63, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
      { id: 'H4', symbol: 'H', nameVi: 'Hydrogen', x: 0.63, y: -0.63, z: -0.63, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
    ],
    bonds: [
      { from: 'C1', to: 'H1', type: 'single', order: 1 },
      { from: 'C1', to: 'H2', type: 'single', order: 1 },
      { from: 'C1', to: 'H3', type: 'single', order: 1 },
      { from: 'C1', to: 'H4', type: 'single', order: 1 }
    ]
  },
  {
    id: 'nh3',
    formula: 'NH3',
    formulaLatex: '$NH_3$',
    nameIupac: 'Ammonia',
    nameVi: 'Khí Amoniac',
    molarMass: 17.03,
    categoryVi: 'Bazơ',
    shapeNameVi: 'Hình chóp tam giác (Trigonal Pyramidal)',
    bondAngleVi: '$107^\\circ$',
    hybridization: '$sp^3$',
    polarityVi: 'Phân tử có cực',
    descriptionVi: 'Nguyên tử $N$ lai hóa $sp^3$ có $1$ cặp electron chưa tham gia liên kết ở đỉnh hình chóp đẩy $3$ liên kết $N-H$ xuống dưới, khiến góc liên kết $H-N-H$ co lại còn $107^\\circ$. Dễ dàng nhận $H^+$ thể hiện tính bazơ.',
    atoms: [
      { id: 'N1', symbol: 'N', nameVi: 'Nitrogen', x: 0, y: 0, z: 0.12, radiusCPK: 0.65, colorCPK: 0x3B82F6, oxidationState: '-3' },
      { id: 'H1', symbol: 'H', nameVi: 'Hydrogen', x: 0, y: 0.94, z: -0.27, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
      { id: 'H2', symbol: 'H', nameVi: 'Hydrogen', x: 0.81, y: -0.47, z: -0.27, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
      { id: 'H3', symbol: 'H', nameVi: 'Hydrogen', x: -0.81, y: -0.47, z: -0.27, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
    ],
    bonds: [
      { from: 'N1', to: 'H1', type: 'single', order: 1 },
      { from: 'N1', to: 'H2', type: 'single', order: 1 },
      { from: 'N1', to: 'H3', type: 'single', order: 1 }
    ]
  },
  {
    id: 'nacl',
    formula: 'NaCl',
    formulaLatex: '$NaCl$',
    nameIupac: 'Sodium chloride',
    nameVi: 'Muối ăn (Natri clorua - Mạng tinh thể)',
    molarMass: 58.44,
    categoryVi: 'Muối',
    shapeNameVi: 'Mạng tinh thể lập phương tâm diện (Ionic Crystal Lattice)',
    bondAngleVi: '$90^\\circ$',
    hybridization: 'Liên kết Ion',
    polarityVi: 'Hợp chất Ion (Cực đại)',
    descriptionVi: 'Trong tinh thể $NaCl$, mỗi ion $Na^+$ được bao quanh bởi $6$ ion $Cl^-$ và ngược lại. Liên kết giữa các ion mang điện tích trái dấu lực hút tĩnh điện rất mạnh làm cho $NaCl$ có nhiệt độ nóng chảy cao ($801^\\circ\\text{C}$).',
    atoms: [
      { id: 'Na1', symbol: 'Na', nameVi: 'Sodium Ion (Na+)', x: 0, y: 0, z: 0, radiusCPK: 0.85, colorCPK: 0x8B5CF6, oxidationState: '+1' },
      { id: 'Cl1', symbol: 'Cl', nameVi: 'Chlorine Ion (Cl-)', x: 1.4, y: 0, z: 0, radiusCPK: 0.80, colorCPK: 0x10B981, oxidationState: '-1' },
      { id: 'Cl2', symbol: 'Cl', nameVi: 'Chlorine Ion (Cl-)', x: -1.4, y: 0, z: 0, radiusCPK: 0.80, colorCPK: 0x10B981, oxidationState: '-1' },
      { id: 'Cl3', symbol: 'Cl', nameVi: 'Chlorine Ion (Cl-)', x: 0, y: 1.4, z: 0, radiusCPK: 0.80, colorCPK: 0x10B981, oxidationState: '-1' },
      { id: 'Cl4', symbol: 'Cl', nameVi: 'Chlorine Ion (Cl-)', x: 0, y: -1.4, z: 0, radiusCPK: 0.80, colorCPK: 0x10B981, oxidationState: '-1' },
      { id: 'Cl5', symbol: 'Cl', nameVi: 'Chlorine Ion (Cl-)', x: 0, y: 0, z: 1.4, radiusCPK: 0.80, colorCPK: 0x10B981, oxidationState: '-1' },
      { id: 'Cl6', symbol: 'Cl', nameVi: 'Chlorine Ion (Cl-)', x: 0, y: 0, z: -1.4, radiusCPK: 0.80, colorCPK: 0x10B981, oxidationState: '-1' },
      { id: 'Na2', symbol: 'Na', nameVi: 'Sodium Ion (Na+)', x: 1.4, y: 1.4, z: 0, radiusCPK: 0.85, colorCPK: 0x8B5CF6, oxidationState: '+1' },
      { id: 'Na3', symbol: 'Na', nameVi: 'Sodium Ion (Na+)', x: -1.4, y: 1.4, z: 0, radiusCPK: 0.85, colorCPK: 0x8B5CF6, oxidationState: '+1' },
    ],
    bonds: [
      { from: 'Na1', to: 'Cl1', type: 'ionic', order: 1 },
      { from: 'Na1', to: 'Cl2', type: 'ionic', order: 1 },
      { from: 'Na1', to: 'Cl3', type: 'ionic', order: 1 },
      { from: 'Na1', to: 'Cl4', type: 'ionic', order: 1 },
      { from: 'Na1', to: 'Cl5', type: 'ionic', order: 1 },
      { from: 'Na1', to: 'Cl6', type: 'ionic', order: 1 },
      { from: 'Cl3', to: 'Na2', type: 'ionic', order: 1 },
      { from: 'Cl3', to: 'Na3', type: 'ionic', order: 1 },
    ]
  },
  {
    id: 'c2h5oh',
    formula: 'C2H5OH',
    formulaLatex: '$C_2H_5OH$',
    nameIupac: 'Ethanol',
    nameVi: 'Ancol Etylic (Rượu Etylic)',
    molarMass: 46.07,
    categoryVi: 'Hợp chất hữu cơ',
    shapeNameVi: 'Mạch hở khúc khuỷu nhóm hydroxyl (-OH)',
    bondAngleVi: '$109{,}5^\\circ$ (Carbon) & $104{,}5^\\circ$ (Oxygen)',
    hybridization: '$sp^3$',
    polarityVi: 'Đầu nhóm $-OH$ có cực, đuôi hiđrocacbon $-C_2H_5$ không cực',
    descriptionVi: 'Phân tử ancol no đơn chức chứa nhóm chức hydroxyl $-OH$. Liên kết $O-H$ phân cực mạnh giúp ancol tan vô hạn trong nước và tạo được liên kết hydrogen liên phân tử.',
    atoms: [
      { id: 'C1', symbol: 'C', nameVi: 'Carbon (C1)', x: -0.75, y: 0, z: 0, radiusCPK: 0.68, colorCPK: 0x334155, oxidationState: '-3' },
      { id: 'C2', symbol: 'C', nameVi: 'Carbon (C2)', x: 0.75, y: 0, z: 0, radiusCPK: 0.68, colorCPK: 0x334155, oxidationState: '-1' },
      { id: 'O1', symbol: 'O', nameVi: 'Oxygen', x: 1.35, y: 1.15, z: 0, radiusCPK: 0.60, colorCPK: 0xEF4444, oxidationState: '-2' },
      { id: 'H1', symbol: 'H', nameVi: 'Hydrogen (OH)', x: 2.20, y: 0.95, z: 0, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
      // Hydrogens on C1
      { id: 'H2', symbol: 'H', nameVi: 'Hydrogen', x: -1.15, y: 0.60, z: 0.88, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
      { id: 'H3', symbol: 'H', nameVi: 'Hydrogen', x: -1.15, y: 0.60, z: -0.88, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
      { id: 'H4', symbol: 'H', nameVi: 'Hydrogen', x: -1.15, y: -1.02, z: 0, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
      // Hydrogens on C2
      { id: 'H5', symbol: 'H', nameVi: 'Hydrogen', x: 1.10, y: -0.60, z: 0.88, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
      { id: 'H6', symbol: 'H', nameVi: 'Hydrogen', x: 1.10, y: -0.60, z: -0.88, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
    ],
    bonds: [
      { from: 'C1', to: 'C2', type: 'single', order: 1 },
      { from: 'C2', to: 'O1', type: 'single', order: 1 },
      { from: 'O1', to: 'H1', type: 'single', order: 1 },
      { from: 'C1', to: 'H2', type: 'single', order: 1 },
      { from: 'C1', to: 'H3', type: 'single', order: 1 },
      { from: 'C1', to: 'H4', type: 'single', order: 1 },
      { from: 'C2', to: 'H5', type: 'single', order: 1 },
      { from: 'C2', to: 'H6', type: 'single', order: 1 },
    ]
  },
  {
    id: 'c6h6',
    formula: 'C6H6',
    formulaLatex: '$C_6H_6$',
    nameIupac: 'Benzene',
    nameVi: 'Benzen (Vòng thơm)',
    molarMass: 78.11,
    categoryVi: 'Hợp chất hữu cơ',
    shapeNameVi: 'Lục giác phẳng thơm (Planar Hexagonal Ring)',
    bondAngleVi: '$120^\\circ$',
    hybridization: '$sp^2$',
    polarityVi: 'Phân tử không cực',
    descriptionVi: 'Cấu trúc vòng lục giác phẳng đối xứng. Tất cả $6$ nguyên tử $C$ ở trạng thái lai hóa $sp^2$ liên kết với nhau và với $6$ nguyên tử $H$. Hệ liên kết $\\pi$ liên hợp giải tỏa đều trên toàn bộ vòng làm benzen có độ bền hóa học đặc biệt.',
    atoms: [
      { id: 'C1', symbol: 'C', nameVi: 'Carbon C1', x: 1.39, y: 0, z: 0, radiusCPK: 0.68, colorCPK: 0x334155, oxidationState: '-1' },
      { id: 'C2', symbol: 'C', nameVi: 'Carbon C2', x: 0.70, y: 1.20, z: 0, radiusCPK: 0.68, colorCPK: 0x334155, oxidationState: '-1' },
      { id: 'C3', symbol: 'C', nameVi: 'Carbon C3', x: -0.70, y: 1.20, z: 0, radiusCPK: 0.68, colorCPK: 0x334155, oxidationState: '-1' },
      { id: 'C4', symbol: 'C', nameVi: 'Carbon C4', x: -1.39, y: 0, z: 0, radiusCPK: 0.68, colorCPK: 0x334155, oxidationState: '-1' },
      { id: 'C5', symbol: 'C', nameVi: 'Carbon C5', x: -0.70, y: -1.20, z: 0, radiusCPK: 0.68, colorCPK: 0x334155, oxidationState: '-1' },
      { id: 'C6', symbol: 'C', nameVi: 'Carbon C6', x: 0.70, y: -1.20, z: 0, radiusCPK: 0.68, colorCPK: 0x334155, oxidationState: '-1' },
      // Hydrogens
      { id: 'H1', symbol: 'H', nameVi: 'Hydrogen H1', x: 2.48, y: 0, z: 0, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
      { id: 'H2', symbol: 'H', nameVi: 'Hydrogen H2', x: 1.24, y: 2.15, z: 0, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
      { id: 'H3', symbol: 'H', nameVi: 'Hydrogen H3', x: -1.24, y: 2.15, z: 0, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
      { id: 'H4', symbol: 'H', nameVi: 'Hydrogen H4', x: -2.48, y: 0, z: 0, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
      { id: 'H5', symbol: 'H', nameVi: 'Hydrogen H5', x: -1.24, y: -2.15, z: 0, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
      { id: 'H6', symbol: 'H', nameVi: 'Hydrogen H6', x: 1.24, y: -2.15, z: 0, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
    ],
    bonds: [
      { from: 'C1', to: 'C2', type: 'double', order: 2 },
      { from: 'C2', to: 'C3', type: 'single', order: 1 },
      { from: 'C3', to: 'C4', type: 'double', order: 2 },
      { from: 'C4', to: 'C5', type: 'single', order: 1 },
      { from: 'C5', to: 'C6', type: 'double', order: 2 },
      { from: 'C6', to: 'C1', type: 'single', order: 1 },
      { from: 'C1', to: 'H1', type: 'single', order: 1 },
      { from: 'C2', to: 'H2', type: 'single', order: 1 },
      { from: 'C3', to: 'H3', type: 'single', order: 1 },
      { from: 'C4', to: 'H4', type: 'single', order: 1 },
      { from: 'C5', to: 'H5', type: 'single', order: 1 },
      { from: 'C6', to: 'H6', type: 'single', order: 1 },
    ]
  },
  {
    id: 'h2so4',
    formula: 'H2SO4',
    formulaLatex: '$H_2SO_4$',
    nameIupac: 'Sulfuric acid',
    nameVi: 'Axit Sulfuric',
    molarMass: 98.07,
    categoryVi: 'Axit',
    shapeNameVi: 'Tứ diện biến dạng xung quanh $S$',
    bondAngleVi: 'Gần $109{,}5^\\circ$',
    hybridization: '$sp^3$ (nguyên tử Lưu huỳnh)',
    polarityVi: 'Phân tử có cực',
    descriptionVi: 'Nguyên tử $S$ liên kết với $2$ nguyên tử $O$ bằng liên kết đôi và $2$ nhóm $-OH$ bằng liên kết đơn. Là axit hai nấc cực mạnh có tính háo nước cao.',
    atoms: [
      { id: 'S1', symbol: 'S', nameVi: 'Sulfur', x: 0, y: 0, z: 0, radiusCPK: 0.80, colorCPK: 0xEAB308, oxidationState: '+6' },
      { id: 'O1', symbol: 'O', nameVi: 'Oxygen (O=S)', x: 0, y: 1.25, z: 0.75, radiusCPK: 0.60, colorCPK: 0xEF4444, oxidationState: '-2' },
      { id: 'O2', symbol: 'O', nameVi: 'Oxygen (O=S)', x: 0, y: -1.25, z: -0.75, radiusCPK: 0.60, colorCPK: 0xEF4444, oxidationState: '-2' },
      { id: 'O3', symbol: 'O', nameVi: 'Oxygen (OH)', x: 1.20, y: 0.40, z: -0.60, radiusCPK: 0.60, colorCPK: 0xEF4444, oxidationState: '-2' },
      { id: 'H1', symbol: 'H', nameVi: 'Hydrogen', x: 1.85, y: 0.90, z: -0.20, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
      { id: 'O4', symbol: 'O', nameVi: 'Oxygen (OH)', x: -1.20, y: -0.40, z: 0.60, radiusCPK: 0.60, colorCPK: 0xEF4444, oxidationState: '-2' },
      { id: 'H2', symbol: 'H', nameVi: 'Hydrogen', x: -1.85, y: -0.90, z: 0.20, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
    ],
    bonds: [
      { from: 'S1', to: 'O1', type: 'double', order: 2 },
      { from: 'S1', to: 'O2', type: 'double', order: 2 },
      { from: 'S1', to: 'O3', type: 'single', order: 1 },
      { from: 'O3', to: 'H1', type: 'single', order: 1 },
      { from: 'S1', to: 'O4', type: 'single', order: 1 },
      { from: 'O4', to: 'H2', type: 'single', order: 1 },
    ]
  },
  {
    id: 'o2',
    formula: 'O2',
    formulaLatex: '$O_2$',
    nameIupac: 'Oxygen gas',
    nameVi: 'Khí Oxi (Liên kết đôi)',
    molarMass: 31.999,
    categoryVi: 'Đơn chất',
    shapeNameVi: 'Đường thẳng (Diatomic)',
    bondAngleVi: 'Không có (Hai nguyên tử)',
    hybridization: 'Không phân loại',
    polarityVi: 'Không cực',
    descriptionVi: 'Phân tử oxi gồm $2$ nguyên tử liên kết với nhau bằng một liên kết đôi cộng hóa trị không cực ($O=O$), cần thiết cho sự sống và phản ứng cháy.',
    atoms: [
      { id: 'O1', symbol: 'O', nameVi: 'Oxygen O1', x: -0.60, y: 0, z: 0, radiusCPK: 0.62, colorCPK: 0xEF4444, oxidationState: '0' },
      { id: 'O2', symbol: 'O', nameVi: 'Oxygen O2', x: 0.60, y: 0, z: 0, radiusCPK: 0.62, colorCPK: 0xEF4444, oxidationState: '0' },
    ],
    bonds: [
      { from: 'O1', to: 'O2', type: 'double', order: 2 }
    ]
  },
  {
    id: 'n2',
    formula: 'N2',
    formulaLatex: '$N_2$',
    nameIupac: 'Nitrogen gas',
    nameVi: 'Khí Nitơ (Liên kết ba rất bền)',
    molarMass: 28.013,
    categoryVi: 'Đơn chất',
    shapeNameVi: 'Đường thẳng (Diatomic)',
    bondAngleVi: 'Không có (Hai nguyên tử)',
    hybridization: 'Không phân loại',
    polarityVi: 'Không cực',
    descriptionVi: 'Hai nguyên tử $N$ liên kết với nhau bằng liên kết ba ($N\\equiv N$) có năng lượng liên kết rất lớn ($946\\text{ kJ/mol}$), làm cho nitơ trơ về mặt hóa học ở nhiệt độ thường.',
    atoms: [
      { id: 'N1', symbol: 'N', nameVi: 'Nitrogen N1', x: -0.55, y: 0, z: 0, radiusCPK: 0.65, colorCPK: 0x3B82F6, oxidationState: '0' },
      { id: 'N2', symbol: 'N', nameVi: 'Nitrogen N2', x: 0.55, y: 0, z: 0, radiusCPK: 0.65, colorCPK: 0x3B82F6, oxidationState: '0' },
    ],
    bonds: [
      { from: 'N1', to: 'N2', type: 'triple', order: 3 }
    ]
  },
  {
    id: 'c2h4',
    formula: 'C2H4',
    formulaLatex: '$C_2H_4$',
    nameIupac: 'Ethene / Ethylene',
    nameVi: 'Etilen (Anken có liên kết đôi C=C)',
    molarMass: 28.05,
    categoryVi: 'Hợp chất hữu cơ',
    shapeNameVi: 'Đồng phẳng (Planar)',
    bondAngleVi: '$120^\\circ$',
    hybridization: '$sp^2$',
    polarityVi: 'Phân tử không cực',
    descriptionVi: 'Anken đơn giản nhất chứa $1$ liên kết đôi $C=C$ gồm $1$ liên kết $\\sigma$ bền và $1$ liên kết $\\pi$ kém bền. Cả $6$ nguyên tử đều nằm trên cùng một mặt phẳng.',
    atoms: [
      { id: 'C1', symbol: 'C', nameVi: 'Carbon C1', x: -0.67, y: 0, z: 0, radiusCPK: 0.68, colorCPK: 0x334155, oxidationState: '-2' },
      { id: 'C2', symbol: 'C', nameVi: 'Carbon C2', x: 0.67, y: 0, z: 0, radiusCPK: 0.68, colorCPK: 0x334155, oxidationState: '-2' },
      { id: 'H1', symbol: 'H', nameVi: 'Hydrogen', x: -1.23, y: 0.93, z: 0, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
      { id: 'H2', symbol: 'H', nameVi: 'Hydrogen', x: -1.23, y: -0.93, z: 0, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
      { id: 'H3', symbol: 'H', nameVi: 'Hydrogen', x: 1.23, y: 0.93, z: 0, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
      { id: 'H4', symbol: 'H', nameVi: 'Hydrogen', x: 1.23, y: -0.93, z: 0, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
    ],
    bonds: [
      { from: 'C1', to: 'C2', type: 'double', order: 2 },
      { from: 'C1', to: 'H1', type: 'single', order: 1 },
      { from: 'C1', to: 'H2', type: 'single', order: 1 },
      { from: 'C2', to: 'H3', type: 'single', order: 1 },
      { from: 'C2', to: 'H4', type: 'single', order: 1 },
    ]
  },
  {
    id: 'c2h2',
    formula: 'C2H2',
    formulaLatex: '$C_2H_2$',
    nameIupac: 'Ethyne / Acetylene',
    nameVi: 'Axetilen (Ankin có liên kết ba C≡C)',
    molarMass: 26.04,
    categoryVi: 'Hợp chất hữu cơ',
    shapeNameVi: 'Đường thẳng (Linear)',
    bondAngleVi: '$180^\\circ$',
    hybridization: '$sp$',
    polarityVi: 'Phân tử không cực',
    descriptionVi: 'Ankin đơn giản nhất chứa $1$ liên kết ba $C\\equiv C$ gồm $1$ liên kết $\\sigma$ và $2$ liên kết $\\pi$. Cả $4$ nguyên tử nằm thẳng hàng trên một đường thẳng.',
    atoms: [
      { id: 'C1', symbol: 'C', nameVi: 'Carbon C1', x: -0.60, y: 0, z: 0, radiusCPK: 0.68, colorCPK: 0x334155, oxidationState: '-1' },
      { id: 'C2', symbol: 'C', nameVi: 'Carbon C2', x: 0.60, y: 0, z: 0, radiusCPK: 0.68, colorCPK: 0x334155, oxidationState: '-1' },
      { id: 'H1', symbol: 'H', nameVi: 'Hydrogen H1', x: -1.66, y: 0, z: 0, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
      { id: 'H2', symbol: 'H', nameVi: 'Hydrogen H2', x: 1.66, y: 0, z: 0, radiusCPK: 0.35, colorCPK: 0xF8FAFC, oxidationState: '+1' },
    ],
    bonds: [
      { from: 'C1', to: 'C2', type: 'triple', order: 3 },
      { from: 'C1', to: 'H1', type: 'single', order: 1 },
      { from: 'C2', to: 'H2', type: 'single', order: 1 },
    ]
  }
];

// Helper to find molecule by formula or ID
export function getMolecule3DByIdOrFormula(query: string): Molecule3D | undefined {
  const q = query.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  return MOLECULES_3D_DATABASE.find(m => 
    m.id.toLowerCase() === q || 
    m.formula.toLowerCase().replace(/[^a-z0-9]/g, '') === q ||
    m.nameIupac.toLowerCase().includes(q) ||
    m.nameVi.toLowerCase().includes(q)
  );
}
