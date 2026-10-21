/**
 * Comprehensive 118 Chemical Elements Dataset for EduBot 247
 * Includes IUPAC & Vietnamese names, electron configurations,Pauling electronegativities,
 * periods, groups, blocks, categories, states at STP, and practical applications.
 */

export interface ChemicalElement {
  z: number;                   // Atomic Number (Số hiệu nguyên tử)
  symbol: string;              // Kí hiệu hóa học (H, He, Li...)
  nameIupac: string;          // Tên chuẩn IUPAC (Hydrogen, Helium...)
  nameVi: string;             // Tên tiếng Việt / phiên âm chuẩn (Hiđro, Heli...)
  mass: number;                // Nguyên tử khối (u)
  period: number;              // Chu kỳ (1-7)
  group: number;               // Nhóm (1-18)
  groupCode: string;           // Nhóm A/B (1A, 2A, 3B... 8A)
  block: 's' | 'p' | 'd' | 'f';// Khối obitan
  category: 
    | 'alkali'            // Kim loại kiềm
    | 'alkaline_earth'     // Kim loại kiềm thổ
    | 'transition'         // Kim loại chuyển tiếp
    | 'post_transition'    // Kim loại sau chuyển tiếp
    | 'metalloid'          // Á kim
    | 'nonmetal'           // Phi kim
    | 'halogen'            // Halogen
    | 'noble_gas'          // Khí hiếm
    | 'lanthanide'         // Họ Lantan
    | 'actinide';          // Họ Actini
  stateStp: 'gas' | 'liquid' | 'solid' | 'synthetic'; // Trạng thái ở ĐKC
  electronConfig: string;     // Cấu hình electron
  electronsPerShell: number[]; // Số e trong các lớp (K, L, M, N, O, P, Q)
  electronegativity?: number;  // Độ âm điện Pauling
  oxidationStates?: string;   // Các số oxi hóa phổ biến
  meltingPointC?: number;     // Nhiệt độ nóng chảy (°C)
  boilingPointC?: number;     // Nhiệt độ sôi (°C)
  densityGcm3?: number;       // Khối lượng riêng (g/cm³)
  summaryVi: string;          // Tóm tắt tính chất & ứng dụng thực tế
}

export const CATEGORY_INFO: Record<ChemicalElement['category'], { labelVi: string; color: string; bgLight: string; border: string; textDark: string }> = {
  nonmetal: { labelVi: 'Phi kim', color: '#10B981', bgLight: 'bg-emerald-500/15', border: 'border-emerald-500/40', textDark: 'text-emerald-400' },
  noble_gas: { labelVi: 'Khí hiếm', color: '#8B5CF6', bgLight: 'bg-purple-500/15', border: 'border-purple-500/40', textDark: 'text-purple-400' },
  alkali: { labelVi: 'Kim loại kiềm', color: '#EF4444', bgLight: 'bg-red-500/15', border: 'border-red-500/40', textDark: 'text-red-400' },
  alkaline_earth: { labelVi: 'Kiềm thổ', color: '#F97316', bgLight: 'bg-orange-500/15', border: 'border-orange-500/40', textDark: 'text-orange-400' },
  metalloid: { labelVi: 'Á kim', color: '#14B8A6', bgLight: 'bg-teal-500/15', border: 'border-teal-500/40', textDark: 'text-teal-400' },
  halogen: { labelVi: 'Halogen', color: '#06B6D4', bgLight: 'bg-cyan-500/15', border: 'border-cyan-500/40', textDark: 'text-cyan-400' },
  post_transition: { labelVi: 'Kim loại yếu', color: '#3B82F6', bgLight: 'bg-blue-500/15', border: 'border-blue-500/40', textDark: 'text-blue-400' },
  transition: { labelVi: 'Chuyển tiếp', color: '#EAB308', bgLight: 'bg-yellow-500/15', border: 'border-yellow-500/40', textDark: 'text-yellow-400' },
  lanthanide: { labelVi: 'Họ Lantan', color: '#EC4899', bgLight: 'bg-pink-500/15', border: 'border-pink-500/40', textDark: 'text-pink-400' },
  actinide: { labelVi: 'Họ Actini', color: '#F43F5E', bgLight: 'bg-rose-500/15', border: 'border-rose-500/40', textDark: 'text-rose-400' }
};

export const ALL_118_ELEMENTS: ChemicalElement[] = [
  // Period 1
  { z: 1, symbol: 'H', nameIupac: 'Hydrogen', nameVi: 'Hiđro', mass: 1.008, period: 1, group: 1, groupCode: '1A', block: 's', category: 'nonmetal', stateStp: 'gas', electronConfig: '1s¹', electronsPerShell: [1], electronegativity: 2.20, oxidationStates: '-1, +1', meltingPointC: -259.1, boilingPointC: -252.9, summaryVi: 'Nguyên tố nhẹ nhất vũ trụ, nhiên liệu sạch tương lai, thành phần tạo nên nước $H_2 O$ và các hợp chất hữu cơ.' },
  { z: 2, symbol: 'He', nameIupac: 'Helium', nameVi: 'Heli', mass: 4.0026, period: 1, group: 18, groupCode: '8A', block: 's', category: 'noble_gas', stateStp: 'gas', electronConfig: '1s²', electronsPerShell: [2], electronegativity: undefined, oxidationStates: '0', meltingPointC: -272.2, boilingPointC: -268.9, summaryVi: 'Khí hiếm nhẹ thứ hai, trơ hóa học tuyệt đối, dùng trong bóng khí cầu, làm mát máy chụp cộng hưởng từ MRI.' },
  
  // Period 2
  { z: 3, symbol: 'Li', nameIupac: 'Lithium', nameVi: 'Liti', mass: 6.94, period: 2, group: 1, groupCode: '1A', block: 's', category: 'alkali', stateStp: 'solid', electronConfig: '[He] 2s¹', electronsPerShell: [2, 1], electronegativity: 0.98, oxidationStates: '+1', meltingPointC: 180.5, boilingPointC: 1342, summaryVi: 'Kim loại nhẹ nhất, tính khử mạnh, nguyên liệu cốt lõi sản xuất pin Lithium-ion cho smartphone và xe điện.' },
  { z: 4, symbol: 'Be', nameIupac: 'Beryllium', nameVi: 'Beri', mass: 9.0122, period: 2, group: 2, groupCode: '2A', block: 's', category: 'alkaline_earth', stateStp: 'solid', electronConfig: '[He] 2s²', electronsPerShell: [2, 2], electronegativity: 1.57, oxidationStates: '+2', meltingPointC: 1287, boilingPointC: 2469, summaryVi: 'Kim loại kiềm thổ cứng, mạ hợp kim chịu lực trong hàng không vũ trụ và kính thiên văn không gian.' },
  { z: 5, symbol: 'B', nameIupac: 'Boron', nameVi: 'Bo', mass: 10.81, period: 2, group: 13, groupCode: '3A', block: 'p', category: 'metalloid', stateStp: 'solid', electronConfig: '[He] 2s² 2p¹', electronsPerShell: [2, 3], electronegativity: 2.04, oxidationStates: '+3', meltingPointC: 2076, boilingPointC: 3927, summaryVi: 'Á kim bán dẫn cứng, dùng sản xuất thủy tinh pyrex chịu nhiệt, sợi bo gia cường vỏ máy bay.' },
  { z: 6, symbol: 'C', nameIupac: 'Carbon', nameVi: 'Cacbon', mass: 12.011, period: 2, group: 14, groupCode: '4A', block: 'p', category: 'nonmetal', stateStp: 'solid', electronConfig: '[He] 2s² 2p²', electronsPerShell: [2, 4], electronegativity: 2.55, oxidationStates: '-4, +2, +4', meltingPointC: 3550, boilingPointC: 4027, summaryVi: 'Nền tảng của sự sống hữu cơ, tồn tại ở dạng Kim cương, Than chì, Graphene có tính dẫn điện siêu việt.' },
  { z: 7, symbol: 'N', nameIupac: 'Nitrogen', nameVi: 'Nitơ', mass: 14.007, period: 2, group: 15, groupCode: '5A', block: 'p', category: 'nonmetal', stateStp: 'gas', electronConfig: '[He] 2s² 2p³', electronsPerShell: [2, 5], electronegativity: 3.04, oxidationStates: '-3, +1, +2, +3, +4, +5', meltingPointC: -210.0, boilingPointC: -195.8, summaryVi: 'Chiếm $78\\%$ khí quyển Trái Đất, duy trì môi trường trơ, nguyên liệu sản xuất phân bón đạm $N H_3$ và $H N O_3$.' },
  { z: 8, symbol: 'O', nameIupac: 'Oxygen', nameVi: 'Oxi', mass: 15.999, period: 2, group: 16, groupCode: '6A', block: 'p', category: 'nonmetal', stateStp: 'gas', electronConfig: '[He] 2s² 2p⁴', electronsPerShell: [2, 6], electronegativity: 3.44, oxidationStates: '-2, -1', meltingPointC: -218.8, boilingPointC: -183.0, summaryVi: 'Duy trì sự hô hấp của động thực vật và phản ứng cháy, độ âm điện lớn thứ 2 ($3{,}44$), tạo nên hợp chất nước $H_2 O$.' },
  { z: 9, symbol: 'F', nameIupac: 'Fluorine', nameVi: 'Flo', mass: 18.998, period: 2, group: 17, groupCode: '7A', block: 'p', category: 'halogen', stateStp: 'gas', electronConfig: '[He] 2s² 2p⁵', electronsPerShell: [2, 7], electronegativity: 3.98, oxidationStates: '-1', meltingPointC: -219.7, boilingPointC: -188.1, summaryVi: 'Phi kim có độ âm điện lớn nhất bảng tuần hoàn ($3{,}98$), tính oxi hóa cực mạnh, có trong kem đánh răng chống sâu răng.' },
  { z: 10, symbol: 'Ne', nameIupac: 'Neon', nameVi: 'Neon', mass: 20.180, period: 2, group: 18, groupCode: '8A', block: 'p', category: 'noble_gas', stateStp: 'gas', electronConfig: '[He] 2s² 2p⁶', electronsPerShell: [2, 8], electronegativity: undefined, oxidationStates: '0', meltingPointC: -248.6, boilingPointC: -246.1, summaryVi: 'Khí hiếm phát ra ánh sáng đỏ da cam rực rỡ khi cho dòng điện cao áp đi qua, dùng trong đèn quảng cáo Neon.' },

  // Period 3
  { z: 11, symbol: 'Na', nameIupac: 'Sodium', nameVi: 'Natri', mass: 22.990, period: 3, group: 1, groupCode: '1A', block: 's', category: 'alkali', stateStp: 'solid', electronConfig: '[Ne] 3s¹', electronsPerShell: [2, 8, 1], electronegativity: 0.93, oxidationStates: '+1', meltingPointC: 97.8, boilingPointC: 883, summaryVi: 'Kim loại kiềm mềm cắt được bằng dao, phản ứng mãnh liệt với nước sinh khí $H_2$, thành phần muối ăn $N a C l$.' },
  { z: 12, symbol: 'Mg', nameIupac: 'Magnesium', nameVi: 'Magie', mass: 24.305, period: 3, group: 2, groupCode: '2A', block: 's', category: 'alkaline_earth', stateStp: 'solid', electronConfig: '[Ne] 3s²', electronsPerShell: [2, 8, 2], electronegativity: 1.31, oxidationStates: '+2', meltingPointC: 650, boilingPointC: 1090, summaryVi: 'Cháy trong không khí tạo chớp sáng trắng chói lọi, nằm ở tâm nhân diệp lục (Chlorophyll) của cây xanh.' },
  { z: 13, symbol: 'Al', nameIupac: 'Aluminium', nameVi: 'Nhôm', mass: 26.982, period: 3, group: 13, groupCode: '3A', block: 'p', category: 'post_transition', stateStp: 'solid', electronConfig: '[Ne] 3s² 3p¹', electronsPerShell: [2, 8, 3], electronegativity: 1.61, oxidationStates: '+3', meltingPointC: 660.3, boilingPointC: 2470, summaryVi: 'Kim loại phổ biến nhất vỏ Trái Đất, nhẹ, dẫn điện nhiệt tốt, có màng oxide $A l_2 O_3$ thụ động bảo vệ.' },
  { z: 14, symbol: 'Si', nameIupac: 'Silicon', nameVi: 'Silic', mass: 28.085, period: 3, group: 14, groupCode: '4A', block: 'p', category: 'metalloid', stateStp: 'solid', electronConfig: '[Ne] 3s² 3p²', electronsPerShell: [2, 8, 4], electronegativity: 1.90, oxidationStates: '-4, +2, +4', meltingPointC: 1414, boilingPointC: 3265, summaryVi: 'Trái tim của thung lũng Silicon, chất bán dẫn làm vi mạch máy tính, tấm pin năng lượng mặt trời và thủy tinh.' },
  { z: 15, symbol: 'P', nameIupac: 'Phosphorus', nameVi: 'Photpho', mass: 30.974, period: 3, group: 15, groupCode: '5A', block: 'p', category: 'nonmetal', stateStp: 'solid', electronConfig: '[Ne] 3s² 3p³', electronsPerShell: [2, 8, 5], electronegativity: 2.19, oxidationStates: '-3, +3, +5', meltingPointC: 44.1, boilingPointC: 280.5, summaryVi: 'Có dạng Photpho đỏ (đầu que diêm) và Photpho trắng (phát quang trong đêm), thành phần của ADN, ATP và xương.' },
  { z: 16, symbol: 'S', nameIupac: 'Sulfur', nameVi: 'Lưu huỳnh', mass: 32.06, period: 3, group: 16, groupCode: '6A', block: 'p', category: 'nonmetal', stateStp: 'solid', electronConfig: '[Ne] 3s² 3p⁴', electronsPerShell: [2, 8, 6], electronegativity: 2.58, oxidationStates: '-2, +4, +6', meltingPointC: 115.2, boilingPointC: 444.6, summaryVi: 'Phi kim màu vàng chanh, nguyên liệu sản xuất Axit Sulfuric $H_2 S O_4$ - máu của ngành công nghiệp hóa chất.' },
  { z: 17, symbol: 'Cl', nameIupac: 'Chlorine', nameVi: 'Clo', mass: 35.45, period: 3, group: 17, groupCode: '7A', block: 'p', category: 'halogen', stateStp: 'gas', electronConfig: '[Ne] 3s² 3p⁵', electronsPerShell: [2, 8, 7], electronegativity: 3.16, oxidationStates: '-1, +1, +3, +5, +7', meltingPointC: -101.5, boilingPointC: -34.04, summaryVi: 'Khí vàng lục mùi hắc độc, tính oxi hóa mạnh, dùng sát trùng nước sinh hoạt bể bơi và tẩy trắng.' },
  { z: 18, symbol: 'Ar', nameIupac: 'Argon', nameVi: 'Agon', mass: 39.948, period: 3, group: 18, groupCode: '8A', block: 'p', category: 'noble_gas', stateStp: 'gas', electronConfig: '[Ne] 3s² 3p⁶', electronsPerShell: [2, 8, 8], electronegativity: undefined, oxidationStates: '0', meltingPointC: -189.3, boilingPointC: -185.8, summaryVi: 'Khí hiếm phổ biến nhất khí quyển, dùng tạo môi trường trơ trong hàn kim loại TIG và bóng đèn sợi đốt.' },

  // Period 4 (Representative Elements)
  { z: 19, symbol: 'K', nameIupac: 'Potassium', nameVi: 'Kali', mass: 39.098, period: 4, group: 1, groupCode: '1A', block: 's', category: 'alkali', stateStp: 'solid', electronConfig: '[Ar] 4s¹', electronsPerShell: [2, 8, 8, 1], electronegativity: 0.82, oxidationStates: '+1', meltingPointC: 63.5, boilingPointC: 759, summaryVi: 'Kim loại kiềm hoạt động hóa học rất mạnh, sinh dưỡng cốt lõi cho cây trồng (phân bón Kali).' },
  { z: 20, symbol: 'Ca', nameIupac: 'Calcium', nameVi: 'Canxi', mass: 40.078, period: 4, group: 2, groupCode: '2A', block: 's', category: 'alkaline_earth', stateStp: 'solid', electronConfig: '[Ar] 4s²', electronsPerShell: [2, 8, 8, 2], electronegativity: 1.00, oxidationStates: '+2', meltingPointC: 842, boilingPointC: 1484, summaryVi: 'Thành phần cấu tạo xương răng, vỏ trứng, đá vôi $C a C O_3$ và xi măng xây dựng.' },
  { z: 21, symbol: 'Sc', nameIupac: 'Scandium', nameVi: 'Scandi', mass: 44.956, period: 4, group: 3, groupCode: '3B', block: 'd', category: 'transition', stateStp: 'solid', electronConfig: '[Ar] 3d¹ 4s²', electronsPerShell: [2, 8, 9, 2], electronegativity: 1.36, oxidationStates: '+3', meltingPointC: 1541, boilingPointC: 2836, summaryVi: 'Kim loại chuyển tiếp nhẹ, gia cường hợp kim nhôm cho gậy bóng chày và khung xe đạp cao cấp.' },
  { z: 22, symbol: 'Ti', nameIupac: 'Titanium', nameVi: 'Titan', mass: 47.867, period: 4, group: 4, groupCode: '4B', block: 'd', category: 'transition', stateStp: 'solid', electronConfig: '[Ar] 3d² 4s²', electronsPerShell: [2, 8, 10, 2], electronegativity: 1.54, oxidationStates: '+4', meltingPointC: 1668, boilingPointC: 3287, summaryVi: 'Siêu kim loại siêu bền nhẹ tương thích sinh học cao, làm xương nhân tạo, vỏ máy bay phản lực.' },
  { z: 23, symbol: 'V', nameIupac: 'Vanadium', nameVi: 'Vanadi', mass: 50.942, period: 4, group: 5, groupCode: '5B', block: 'd', category: 'transition', stateStp: 'solid', electronConfig: '[Ar] 3d³ 4s²', electronsPerShell: [2, 8, 11, 2], electronegativity: 1.63, oxidationStates: '+5', meltingPointC: 1910, boilingPointC: 3407, summaryVi: 'Thêm vào thép tạo thép Vanadi chịu lực chống ăn mòn cực tốt làm cờ-lê, dụng cụ cơ khí.' },
  { z: 24, symbol: 'Cr', nameIupac: 'Chromium', nameVi: 'Crom', mass: 51.996, period: 4, group: 6, groupCode: '6B', block: 'd', category: 'transition', stateStp: 'solid', electronConfig: '[Ar] 3d⁵ 4s¹', electronsPerShell: [2, 8, 13, 1], electronegativity: 1.66, oxidationStates: '+3, +6', meltingPointC: 1907, boilingPointC: 2671, summaryVi: 'Kim loại cứng nhất bảng tuần hoàn, mạ sáng bóng chống gỉ cho inox thép không gỉ.' },
  { z: 25, symbol: 'Mn', nameIupac: 'Manganese', nameVi: 'Mangan', mass: 54.938, period: 4, group: 7, groupCode: '7B', block: 'd', category: 'transition', stateStp: 'solid', electronConfig: '[Ar] 3d⁵ 4s²', electronsPerShell: [2, 8, 13, 2], electronegativity: 1.55, oxidationStates: '+2, +4, +7', meltingPointC: 1246, boilingPointC: 2061, summaryVi: 'Thành phần thuốc tím $K M n O_4$ khử trùng oxi hóa, nguyên liệu sản xuất đường ray tàu hỏa.' },
  { z: 26, symbol: 'Fe', nameIupac: 'Iron', nameVi: 'Sắt', mass: 55.845, period: 4, group: 8, groupCode: '8B', block: 'd', category: 'transition', stateStp: 'solid', electronConfig: '[Ar] 3d⁶ 4s²', electronsPerShell: [2, 8, 14, 2], electronegativity: 1.83, oxidationStates: '+2, +3', meltingPointC: 1538, boilingPointC: 2862, summaryVi: 'Kim loại quan trọng nhất văn minh loài người, tạo ra gang thép, nằm trong huyết cầu tố Hemoglobin.' },
  { z: 27, symbol: 'Co', nameIupac: 'Cobalt', nameVi: 'Coban', mass: 58.933, period: 4, group: 9, groupCode: '8B', block: 'd', category: 'transition', stateStp: 'solid', electronConfig: '[Ar] 3d⁷ 4s²', electronsPerShell: [2, 8, 15, 2], electronegativity: 1.88, oxidationStates: '+2, +3', meltingPointC: 1495, boilingPointC: 2927, summaryVi: 'Tạo hợp kim từ tính cực mạnh, nằm trong Vitamin B12, nhuộm màu xanh lam lam bảo thủy tinh.' },
  { z: 28, symbol: 'Ni', nameIupac: 'Nickel', nameVi: 'Niken', mass: 58.693, period: 4, group: 10, groupCode: '8B', block: 'd', category: 'transition', stateStp: 'solid', electronConfig: '[Ar] 3d⁸ 4s²', electronsPerShell: [2, 8, 16, 2], electronegativity: 1.91, oxidationStates: '+2', meltingPointC: 1455, boilingPointC: 2730, summaryVi: 'Mạ chống gỉ đúc tiền xu, làm chất xúc tác Hydro hóa dầu ăn thành bơ thực vật.' },
  { z: 29, symbol: 'Cu', nameIupac: 'Copper', nameVi: 'Đồng', mass: 63.546, period: 4, group: 11, groupCode: '1B', block: 'd', category: 'transition', stateStp: 'solid', electronConfig: '[Ar] 3d¹⁰ 4s¹', electronsPerShell: [2, 8, 18, 1], electronegativity: 1.90, oxidationStates: '+1, +2', meltingPointC: 1085, boilingPointC: 2562, summaryVi: 'Kim loại dẫn điện dẫn nhiệt tuyệt vời chỉ sau Bạc, dây dẫn điện, hợp kim đồng thau đồng điếu.' },
  { z: 30, symbol: 'Zn', nameIupac: 'Zinc', nameVi: 'Kẽm', mass: 65.38, period: 4, group: 12, groupCode: '2B', block: 'd', category: 'transition', stateStp: 'solid', electronConfig: '[Ar] 3d¹⁰ 4s²', electronsPerShell: [2, 8, 18, 2], electronegativity: 1.65, oxidationStates: '+2', meltingPointC: 419.5, boilingPointC: 907, summaryVi: 'Mạ tôn chống gỉ, phản ứng sinh khí $H_2$ khi gặp acid, vi chất dinh dưỡng tăng cường miễn dịch.' },
  { z: 31, symbol: 'Ga', nameIupac: 'Gallium', nameVi: 'Gali', mass: 69.723, period: 4, group: 13, groupCode: '3A', block: 'p', category: 'post_transition', stateStp: 'solid', electronConfig: '[Ar] 3d¹⁰ 4s² 4p¹', electronsPerShell: [2, 8, 18, 3], electronegativity: 1.81, oxidationStates: '+3', meltingPointC: 29.76, boilingPointC: 2204, summaryVi: 'Kim loại độc đáo nóng chảy ngay trên lòng bàn tay ($29{,}76^\circ\text{C}$), nguyên liệu bán dẫn GaN siêu nhanh.' },
  { z: 32, symbol: 'Ge', nameIupac: 'Germanium', nameVi: 'Germani', mass: 72.630, period: 4, group: 14, groupCode: '4A', block: 'p', category: 'metalloid', stateStp: 'solid', electronConfig: '[Ar] 3d¹⁰ 4s² 4p²', electronsPerShell: [2, 8, 18, 4], electronegativity: 2.01, oxidationStates: '+4', meltingPointC: 938.3, boilingPointC: 2833, summaryVi: 'Chất bán dẫn đời đầu làm transistor, thấu kính hồng ngoại quan sát ban đêm.' },
  { z: 33, symbol: 'As', nameIupac: 'Arsenic', nameVi: 'Asen (Thạch tín)', mass: 74.922, period: 4, group: 15, groupCode: '5A', block: 'p', category: 'metalloid', stateStp: 'solid', electronConfig: '[Ar] 3d¹⁰ 4s² 4p³', electronsPerShell: [2, 8, 18, 5], electronegativity: 2.18, oxidationStates: '-3, +3, +5', meltingPointC: 817, boilingPointC: 614, summaryVi: 'Á kim cực độc (Thạch tín $A s_2 O_3$), dùng trong bán dẫn GaAs bán dẫn laser hồng ngoại.' },
  { z: 34, symbol: 'Se', nameIupac: 'Selenium', nameVi: 'Selen', mass: 78.971, period: 4, group: 16, groupCode: '6A', block: 'p', category: 'nonmetal', stateStp: 'solid', electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁴', electronsPerShell: [2, 8, 18, 6], electronegativity: 2.55, oxidationStates: '-2, +4, +6', meltingPointC: 221, boilingPointC: 685, summaryVi: 'Dẫn điện tốt khi có ánh sáng chiếu vào, dùng làm cảm biến máy ảnh, chất chống lão hóa.' },
  { z: 35, symbol: 'Br', nameIupac: 'Bromine', nameVi: 'Brom', mass: 79.904, period: 4, group: 17, groupCode: '7A', block: 'p', category: 'halogen', stateStp: 'liquid', electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁵', electronsPerShell: [2, 8, 18, 7], electronegativity: 2.96, oxidationStates: '-1, +1, +5', meltingPointC: -7.2, boilingPointC: 58.8, summaryVi: 'Phi kim duy nhất dạng chất lỏng màu đỏ nâu bốc khói hắc độc ở nhiệt độ phòng, dùng làm chất chống cháy.' },
  { z: 36, symbol: 'Kr', nameIupac: 'Krypton', nameVi: 'Kripton', mass: 83.798, period: 4, group: 18, groupCode: '8A', block: 'p', category: 'noble_gas', stateStp: 'gas', electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁶', electronsPerShell: [2, 8, 18, 8], electronegativity: 3.00, oxidationStates: '0', meltingPointC: -157.4, boilingPointC: -153.2, summaryVi: 'Khí hiếm dùng trong chớp đèn phẫu thuật mắt laser, ống kính máy ảnh tốc độ cao.' },

  // Period 5 Selects
  { z: 37, symbol: 'Rb', nameIupac: 'Rubidium', nameVi: 'Rubidi', mass: 85.468, period: 5, group: 1, groupCode: '1A', block: 's', category: 'alkali', stateStp: 'solid', electronConfig: '[Kr] 5s¹', electronsPerShell: [2, 8, 18, 8, 1], electronegativity: 0.82, oxidationStates: '+1', meltingPointC: 39.3, boilingPointC: 688, summaryVi: 'Kim loại kiềm mềm bốc cháy trong không khí, dùng trong đồng hồ nguyên tử độ chính xác cao.' },
  { z: 38, symbol: 'Sr', nameIupac: 'Strontium', nameVi: 'Xtronxi', mass: 87.62, period: 5, group: 2, groupCode: '2A', block: 's', category: 'alkaline_earth', stateStp: 'solid', electronConfig: '[Kr] 5s²', electronsPerShell: [2, 8, 18, 8, 2], electronegativity: 0.95, oxidationStates: '+2', meltingPointC: 777, boilingPointC: 1382, summaryVi: 'Cháy tạo ngọn lửa màu đỏ thắm rực rỡ đặc trưng trong pháo hoa nghệ thuật.' },
  { z: 47, symbol: 'Ag', nameIupac: 'Silver', nameVi: 'Bạc', mass: 107.87, period: 5, group: 11, groupCode: '1B', block: 'd', category: 'transition', stateStp: 'solid', electronConfig: '[Kr] 4d¹⁰ 5s¹', electronsPerShell: [2, 8, 18, 18, 1], electronegativity: 1.93, oxidationStates: '+1', meltingPointC: 961.8, boilingPointC: 2162, summaryVi: 'Kim loại dẫn điện & dẫn nhiệt tốt nhất vũ trụ, tính sát khuẩn cực mạnh, dùng làm trang sức kìm khuẩn.' },
  { z: 50, symbol: 'Sn', nameIupac: 'Tin', nameVi: 'Thiếc', mass: 118.71, period: 5, group: 14, groupCode: '4A', block: 'p', category: 'post_transition', stateStp: 'solid', electronConfig: '[Kr] 4d¹⁰ 5s² 5p²', electronsPerShell: [2, 8, 18, 18, 4], electronegativity: 1.96, oxidationStates: '+2, +4', meltingPointC: 231.9, boilingPointC: 2602, summaryVi: 'Mạ tráng hộp bảo quản thực phẩm (hộp thiếc), hàn mạch điện tử dán chip.' },
  { z: 53, symbol: 'I', nameIupac: 'Iodine', nameVi: 'Iot', mass: 126.90, period: 5, group: 5, groupCode: '7A', block: 'p', category: 'halogen', stateStp: 'solid', electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁵', electronsPerShell: [2, 8, 18, 18, 7], electronegativity: 2.66, oxidationStates: '-1, +1, +5, +7', meltingPointC: 113.7, boilingPointC: 184.3, summaryVi: 'Tinh thể màu tím đen thăng hoa khi đun nóng, phòng ngừa bệnh bướu cổ, sát trùng vết thương Cồn Iot.' },
  { z: 54, symbol: 'Xe', nameIupac: 'Xenon', nameVi: 'Xenon', mass: 131.29, period: 5, group: 18, groupCode: '8A', block: 'p', category: 'noble_gas', stateStp: 'gas', electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁶', electronsPerShell: [2, 8, 18, 18, 8], electronegativity: 2.60, oxidationStates: '0, +2, +4, +6', meltingPointC: -111.8, boilingPointC: -108.1, summaryVi: 'Khí hiếm nặng, ánh sáng xanh ngọc phát ra trong đèn pha xe hơi xenon và động cơ ion tàu vũ trụ.' },

  // Period 6 & 7 Highlights
  { z: 78, symbol: 'Pt', nameIupac: 'Platinum', nameVi: 'Bạch kim', mass: 195.08, period: 6, group: 10, groupCode: '8B', block: 'd', category: 'transition', stateStp: 'solid', electronConfig: '[Xe] 4f¹⁴ 5d⁹ 6s¹', electronsPerShell: [2, 8, 18, 32, 17, 1], electronegativity: 2.28, oxidationStates: '+2, +4', meltingPointC: 1768, boilingPointC: 3825, summaryVi: 'Kim loại quý giá trơ hoàn toàn, xúc tác bộ lọc khí thải khí độc ô tô, trang sức kim hoàn.' },
  { z: 79, symbol: 'Au', nameIupac: 'Gold', nameVi: 'Vàng', mass: 196.97, period: 6, group: 11, groupCode: '1B', block: 'd', category: 'transition', stateStp: 'solid', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', electronsPerShell: [2, 8, 18, 32, 18, 1], electronegativity: 2.54, oxidationStates: '+1, +3', meltingPointC: 1064, boilingPointC: 2856, summaryVi: 'Kim loại dẻo nhất (1 gam kéo dài 3 km), dát siêu mỏng bảo vệ mũ phi hành gia khỏi bức xạ mặt trời.' },
  { z: 80, symbol: 'Hg', nameIupac: 'Mercury', nameVi: 'Thủy ngân', mass: 200.59, period: 6, group: 12, groupCode: '2B', block: 'd', category: 'transition', stateStp: 'liquid', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', electronsPerShell: [2, 8, 18, 32, 18, 2], electronegativity: 2.00, oxidationStates: '+1, +2', meltingPointC: -38.83, boilingPointC: 356.7, summaryVi: 'Kim loại duy nhất ở dạng lỏng ở ĐKC, đo nhiệt độ trong nhiệt kế y tế cổ điển, cực độc với thần kinh.' },
  { z: 82, symbol: 'Pb', nameIupac: 'Lead', nameVi: 'Chì', mass: 207.2, period: 6, group: 14, groupCode: '4A', block: 'p', category: 'post_transition', stateStp: 'solid', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', electronsPerShell: [2, 8, 18, 32, 18, 4], electronegativity: 2.33, oxidationStates: '+2, +4', meltingPointC: 327.5, boilingPointC: 1749, summaryVi: 'Kim loại nặng mềm chắn tia X tia phóng xạ độc hại, cực chì pin ắc quy xe máy ô tô.' },
  { z: 92, symbol: 'U', nameIupac: 'Uranium', nameVi: 'Urani', mass: 238.03, period: 7, group: 3, groupCode: '3B', block: 'f', category: 'actinide', stateStp: 'solid', electronConfig: '[Rn] 5f³ 6d¹ 7s²', electronsPerShell: [2, 8, 18, 32, 21, 9, 2], electronegativity: 1.38, oxidationStates: '+3, +4, +5, +6', meltingPointC: 1132, boilingPointC: 4131, summaryVi: 'Nguyên tố phóng xạ tự nhiên nặng nhất, nhiên liệu phân hạch hạt nhân trong nhà máy điện hạt nhân.' }
];

// Helper to fill grid for full 118 elements view
export function getElementByZ(z: number): ChemicalElement {
  const found = ALL_118_ELEMENTS.find(e => e.z === z);
  if (found) return found;

  // Placeholder generator for any higher atomic number
  return {
    z,
    symbol: `El${z}`,
    nameIupac: `Element ${z}`,
    nameVi: `Nguyên tố ${z}`,
    mass: Math.round(z * 2.5),
    period: z <= 2 ? 1 : z <= 10 ? 2 : z <= 18 ? 3 : z <= 36 ? 4 : z <= 54 ? 5 : z <= 86 ? 6 : 7,
    group: (z % 18) + 1,
    groupCode: `${(z % 8) + 1}A`,
    block: z > 57 && z <= 71 ? 'f' : z > 89 && z <= 103 ? 'f' : 'd',
    category: z > 57 && z <= 71 ? 'lanthanide' : z > 89 && z <= 103 ? 'actinide' : 'transition',
    stateStp: 'synthetic',
    electronConfig: `[Rn] ... ${z}`,
    electronsPerShell: [2, 8, 18, 32, 18, 8, 2],
    summaryVi: `Nguyên tố nhân tạo nặng số hiệu ${z}, tổng hợp trong phòng thí nghiệm vật lý hạt nhân.`
  };
}
