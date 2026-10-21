/**
 * Chemistry Reactions, Compound Synthesizer & Virtual Lab Data
 */

export interface ChemicalCompound {
  formula: string;              // Công thức hóa học (H2O, NaCl, CO2, H2SO4)
  nameIupac: string;            // Tên IUPAC (Water, Sodium chloride...)
  nameVi: string;               // Tên tiếng Việt (Nước, Muối ăn, Khí Cacbonic...)
  molarMass: number;            // Mols mass (g/mol)
  type: 'oxide' | 'acid' | 'base' | 'salt' | 'organic' | 'element_molecule';
  state: 'gas' | 'liquid' | 'solid' | 'aqueous';
  colorCode: string;            // Màu hiển thị đại diện
  elementsRequired: Record<string, number>; // { H: 2, O: 1 }
  descriptionVi: string;        // Mô tả & ứng dụng
  structure2D: {
    shape: 'linear' | 'bent' | 'trigonal_pyramidal' | 'tetrahedral' | 'crystalline' | 'diatomic';
    bonds: { from: string; to: string; type: 'single' | 'double' | 'triple' | 'ionic' }[];
  };
}

export const POPULAR_COMPOUNDS: ChemicalCompound[] = [
  {
    formula: 'H₂O',
    nameIupac: 'Water / Dihydrogen monoxide',
    nameVi: 'Nước',
    molarMass: 18.015,
    type: 'oxide',
    state: 'liquid',
    colorCode: '#3B82F6',
    elementsRequired: { H: 2, O: 1 },
    descriptionVi: 'Dung môi sự sống, phân tử góc $104{,}5^\circ$ với liên kết cộng hóa trị có cực.',
    structure2D: { shape: 'bent', bonds: [{ from: 'O', to: 'H1', type: 'single' }, { from: 'O', to: 'H2', type: 'single' }] }
  },
  {
    formula: 'NaCl',
    nameIupac: 'Sodium chloride',
    nameVi: 'Muối ăn (Natri clorua)',
    molarMass: 58.44,
    type: 'salt',
    state: 'solid',
    colorCode: '#E2E8F0',
    elementsRequired: { Na: 1, Cl: 1 },
    descriptionVi: 'Mạng tinh thể ion bền vững giữa $Na^+$ và $Cl^-$, thành phần gia vị và nước muối sinh lý $0{,}9\\%$.',
    structure2D: { shape: 'crystalline', bonds: [{ from: 'Na', to: 'Cl', type: 'ionic' }] }
  },
  {
    formula: 'CO₂',
    nameIupac: 'Carbon dioxide',
    nameVi: 'Khí Cacbonic',
    molarMass: 44.01,
    type: 'oxide',
    state: 'gas',
    colorCode: '#94A3B8',
    elementsRequired: { C: 1, O: 2 },
    descriptionVi: 'Phân tử thẳng $180^\circ$ không cực, sản phẩm hô hấp và nguyên liệu quang hợp cây xanh.',
    structure2D: { shape: 'linear', bonds: [{ from: 'C', to: 'O1', type: 'double' }, { from: 'C', to: 'O2', type: 'double' }] }
  },
  {
    formula: 'HCl',
    nameIupac: 'Hydrogen chloride',
    nameVi: 'Axit Clohiđric',
    molarMass: 36.46,
    type: 'acid',
    state: 'aqueous',
    colorCode: '#F59E0B',
    elementsRequired: { H: 1, Cl: 1 },
    descriptionVi: 'Axit mạnh có trong dịch vị dạ dày giúp tiêu hóa thức ăn, hòa tan kim loại hoạt động.',
    structure2D: { shape: 'diatomic', bonds: [{ from: 'H', to: 'Cl', type: 'single' }] }
  },
  {
    formula: 'H₂SO₄',
    nameIupac: 'Sulfuric acid',
    nameVi: 'Axit Sulfuric',
    molarMass: 98.07,
    type: 'acid',
    state: 'liquid',
    colorCode: '#EF4444',
    elementsRequired: { H: 2, S: 1, O: 4 },
    descriptionVi: 'Vua của các loại acid, háo nước cực mạnh, nguyên liệu then chốt ngành công nghiệp hóa chất.',
    structure2D: { shape: 'tetrahedral', bonds: [{ from: 'S', to: 'O1', type: 'double' }, { from: 'S', to: 'O2', type: 'double' }, { from: 'S', to: 'OH1', type: 'single' }, { from: 'S', to: 'OH2', type: 'single' }] }
  },
  {
    formula: 'NH₃',
    nameIupac: 'Ammonia',
    nameVi: 'Khí Amoniac',
    molarMass: 17.03,
    type: 'base',
    state: 'gas',
    colorCode: '#10B981',
    elementsRequired: { N: 1, H: 3 },
    descriptionVi: 'Cấu trúc hình chóp tam giác, mùi khai nồng, tan nhiều trong nước tạo dung dịch bazơ yếu.',
    structure2D: { shape: 'trigonal_pyramidal', bonds: [{ from: 'N', to: 'H1', type: 'single' }, { from: 'N', to: 'H2', type: 'single' }, { from: 'N', to: 'H3', type: 'single' }] }
  },
  {
    formula: 'CaCO₃',
    nameIupac: 'Calcium carbonate',
    nameVi: 'Canxi cacbonat (Đá vôi)',
    molarMass: 100.09,
    type: 'salt',
    state: 'solid',
    colorCode: '#F8FAFC',
    elementsRequired: { Ca: 1, C: 1, O: 3 },
    descriptionVi: 'Thành phần chính của đá vôi, vôi sống, vỏ sò vỏ trứng, bị nhiệt phân tạo $CaO$ và $CO_2$.',
    structure2D: { shape: 'crystalline', bonds: [{ from: 'Ca', to: 'CO3', type: 'ionic' }] }
  },
  {
    formula: 'NaOH',
    nameIupac: 'Sodium hydroxide',
    nameVi: 'Natri hiđroxit (Xút ăn da)',
    molarMass: 39.997,
    type: 'base',
    state: 'solid',
    colorCode: '#8B5CF6',
    elementsRequired: { Na: 1, O: 1, H: 1 },
    descriptionVi: 'Bazơ mạnh kiềm ăn da, làm quỳ tím hóa xanh, nguyên liệu xà phòng hóa và xử lý nước thải.',
    structure2D: { shape: 'crystalline', bonds: [{ from: 'Na', to: 'OH', type: 'ionic' }] }
  },
  {
    formula: 'CH₄',
    nameIupac: 'Methane',
    nameVi: 'Khí Metan',
    molarMass: 16.04,
    type: 'organic',
    state: 'gas',
    colorCode: '#06B6D4',
    elementsRequired: { C: 1, H: 4 },
    descriptionVi: 'Ankan đơn giản nhất, cấu trúc tứ diện đều góc $109{,}5^\circ$, thành phần chính của khí thiên nhiên và khí sinh học biogas.',
    structure2D: { shape: 'tetrahedral', bonds: [{ from: 'C', to: 'H1', type: 'single' }, { from: 'C', to: 'H2', type: 'single' }, { from: 'C', to: 'H3', type: 'single' }, { from: 'C', to: 'H4', type: 'single' }] }
  },
  {
    formula: 'HNO₃',
    nameIupac: 'Nitric acid',
    nameVi: 'Axit Nitric',
    molarMass: 63.01,
    type: 'acid',
    state: 'liquid',
    colorCode: '#EC4899',
    elementsRequired: { H: 1, N: 1, O: 3 },
    descriptionVi: 'Axit mạnh có tính oxi hóa cực mạnh hòa tan hầu hết kim loại (trừ $Au, Pt$), tạo khói màu nâu đỏ $NO_2$.',
    structure2D: { shape: 'bent', bonds: [{ from: 'N', to: 'O1', type: 'double' }, { from: 'N', to: 'O2', type: 'single' }, { from: 'N', to: 'OH', type: 'single' }] }
  },
  {
    formula: 'Fe₂O₃',
    nameIupac: 'Iron(III) oxide',
    nameVi: 'Sắt(III) oxit (Gỉ sắt)',
    molarMass: 159.69,
    type: 'oxide',
    state: 'solid',
    colorCode: '#B45309',
    elementsRequired: { Fe: 2, O: 3 },
    descriptionVi: 'Chất rắn màu đỏ nâu, quặng hematit nguyên liệu sản xuất gang thép trong lò cao.',
    structure2D: { shape: 'crystalline', bonds: [{ from: 'Fe', to: 'O', type: 'ionic' }] }
  }
];

export interface VirtualReaction {
  id: string;
  title: string;
  gradeLevel: string;
  equationDisplay: string; // LaTeX equation
  reactants: { formula: string; coeff: number }[];
  products: { formula: string; coeff: number }[];
  phenomenonVi: string;
  visualEffect: 'gas_bubbles' | 'precipitate_white' | 'precipitate_redbrown' | 'precipitate_blue' | 'flame_yellow' | 'decolorization';
  solutionColor: string;
  hasHeat: boolean;
}

export const VIRTUAL_REACTIONS: VirtualReaction[] = [
  {
    id: 'rx-zn-hcl',
    title: 'Kim loại Zinc (Kẽm) phản ứng với Axit Clohiđric',
    gradeLevel: 'Lớp 8 - 12',
    equationDisplay: '$$\\text{Zn} + 2\\text{HCl} \\rightarrow \\text{ZnCl}_2 + \\text{H}_2\\uparrow$$',
    reactants: [{ formula: 'Zn', coeff: 1 }, { formula: 'HCl', coeff: 2 }],
    products: [{ formula: 'ZnCl₂', coeff: 1 }, { formula: 'H₂', coeff: 1 }],
    phenomenonVi: 'Lá kẽm tan dần, bọt khí không màu Hydrogen ($H_2$) sủi mạnh thoát ra khỏi bề mặt dung dịch. Ống nghiệm ấm lên tỏa nhiệt.',
    visualEffect: 'gas_bubbles',
    solutionColor: '#E2E8F0',
    hasHeat: true
  },
  {
    id: 'rx-ba-so4',
    title: 'Phản ứng tạo kết tủa Barium Sulfate trắng đặc trưng',
    gradeLevel: 'Lớp 9 - 12',
    equationDisplay: '$$\\text{BaCl}_2 + \\text{H}_2\\text{SO}_4 \\rightarrow \\text{BaSO}_4\\downarrow + 2\\text{HCl}$$',
    reactants: [{ formula: 'BaCl₂', coeff: 1 }, { formula: 'H₂SO₄', coeff: 1 }],
    products: [{ formula: 'BaSO₄', coeff: 1 }, { formula: 'HCl', coeff: 2 }],
    phenomenonVi: 'Xuất hiện ngay lập tức kết tủa màu trắng đục $BaSO_4$ không tan trong acid mạnh, dùng để nhận biết gốc Sulfate ($SO_4^{2-}$).',
    visualEffect: 'precipitate_white',
    solutionColor: '#FFFFFF',
    hasHeat: false
  },
  {
    id: 'rx-fe-cuso4',
    title: 'Sắt đẩy Đồng ra khỏi dung dịch Đồng(II) Sulfate',
    gradeLevel: 'Lớp 9 - 12',
    equationDisplay: '$$\\text{Fe} + \\text{CuSO}_4 \\rightarrow \\text{FeSO}_4 + \\text{Cu}\\downarrow$$',
    reactants: [{ formula: 'Fe', coeff: 1 }, { formula: 'CuSO₄', coeff: 1 }],
    products: [{ formula: 'FeSO₄', coeff: 1 }, { formula: 'Cu', coeff: 1 }],
    phenomenonVi: 'Đinh sắt bám một lớp kim loại màu đỏ gạch (Cu), màu xanh lam nhạt dần chuyển sang màu xanh lục nhạt ($FeSO_4$).',
    visualEffect: 'precipitate_redbrown',
    solutionColor: '#38BDF8',
    hasHeat: false
  },
  {
    id: 'rx-na-water',
    title: 'Natri phản ứng mãnh liệt với Nước',
    gradeLevel: 'Lớp 8 - 12',
    equationDisplay: '$$2\\text{Na} + 2\\text{H}_2\\text{O} \\rightarrow 2\\text{NaOH} + \\text{H}_2\\uparrow$$',
    reactants: [{ formula: 'Na', coeff: 2 }, { formula: 'H₂O', coeff: 2 }],
    products: [{ formula: 'NaOH', coeff: 2 }, { formula: 'H₂', coeff: 1 }],
    phenomenonVi: 'Mẩu Natri nóng chảy thành viên tròn chạy nhảy trên mặt nước, nóng đỏ và phát ra tiếng nổ sủi bọt khí mạnh. Nhỏ phenolphthalein dung dịch hóa hồng thẫm.',
    visualEffect: 'flame_yellow',
    solutionColor: '#F43F5E',
    hasHeat: true
  },
  {
    id: 'rx-caco3-heat',
    title: 'Nhiệt phân Đá vôi $CaCO_3$ sản xuất Vôi sống',
    gradeLevel: 'Lớp 9 - 12',
    equationDisplay: '$$\\text{CaCO}_3 \\xrightarrow{t^\\circ} \\text{CaO} + \\text{CO}_2\\uparrow$$',
    reactants: [{ formula: 'CaCO₃', coeff: 1 }],
    products: [{ formula: 'CaO', coeff: 1 }, { formula: 'CO₂', coeff: 1 }],
    phenomenonVi: 'Đun nóng đá vôi ở $900^\circ\\text{C}$ phân hủy thành vôi sống $CaO$ dạng xốp và khí $CO_2$ làm đục nước vôi trong.',
    visualEffect: 'gas_bubbles',
    solutionColor: '#CBD5E1',
    hasHeat: true
  }
];
