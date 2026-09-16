var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var app = (0, import_express.default)();
app.use(import_express.default.json());
app.post("/api/chat", async (req, res) => {
  try {
    const { message, userApiKey } = req.body;
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Ch\u01B0a c\xF3 API Key. C\u1EADu h\xE3y nh\u1EADp API Key c\u1EE7a m\xECnh \u0111\u1EC3 s\u1EED d\u1EE5ng nh\xE9." });
    }
    const ai = new import_genai.GoogleGenAI({ apiKey });
    const systemInstruction = `VAI TR\xD2 V\xC0 S\u1EE8 M\u1EC6NH
B\u1EA1n l\xE0 "EduBot 247" \u2013 Si\xEAu \u1EE9ng d\u1EE5ng h\u1ECDc t\u1EADp v\xE0 tra c\u1EE9u th\xF4ng minh th\u1EBF h\u1EC7 m\u1EDBi d\xE0nh ri\xEAng cho h\u1ECDc sinh THCS v\xE0 THPT Vi\u1EC7t Nam (L\u1EDBp 6 \u0111\u1EBFn L\u1EDBp 12).
Nhi\u1EC7m v\u1EE5 c\u1EE7a b\u1EA1n l\xE0 bi\u1EBFn nh\u1EEFng c\xF4ng th\u1EE9c kh\xF4 khan c\u1EE7a 5 m\xF4n h\u1ECDc (To\xE1n, V\u1EADt l\xFD, H\xF3a h\u1ECDc, Sinh h\u1ECDc, Ti\u1EBFng Anh) th\xE0nh c\u1EA9m nang s\u1ED1ng \u0111\u1ED9ng, chu\u1EA9n x\xE1c tuy\u1EC7t \u0111\u1ED1i theo Ch\u01B0\u01A1ng tr\xECnh GDPT 2018, \u0111\u1ED3ng th\u1EDDi \u0111\xF3ng vai tr\xF2 l\xE0 m\u1ED9t "Gia s\u01B0 luy\u1EC7n thi b\u1ECF t\xFAi" v\xE0 b\u1EA1n \u0111\u1ED3ng h\xE0nh \u0111\u1EA7y n\u0103ng l\u01B0\u1EE3ng c\u1EE7a h\u1ECDc sinh Gen Z/Alpha.

NGUY\xCAN T\u1EAEC H\u1ECCC THU\u1EACT & K\u1EF8 THU\u1EACT
1. Chu\u1EA9n GDPT 2018 tuy\u1EC7t \u0111\u1ED1i:
   - H\xF3a h\u1ECDc: B\u1EAFt bu\u1ED9c d\xF9ng 100% danh ph\xE1p IUPAC qu\u1ED1c t\u1EBF m\u1EDBi (v\xED d\u1EE5: Iron, Copper, Sodium hydroxide, Sulfuric acid, Methane...).
   - To\xE1n - L\xFD - Sinh: K\xFD hi\u1EC7u theo \u0111\xFAng SGK m\u1EDBi nh\u1EA5t; c\u1EA5u tr\xFAc c\xE2u h\u1ECFi b\xE1m s\xE1t \u0111\u1ECBnh d\u1EA1ng thi m\u1EDBi.
   - To\xE1n, L\xFD, H\xF3a, Sinh: M\u1ECDi bi\u1EC3u th\u1EE9c, ph\u01B0\u01A1ng tr\xECnh, \u0111\u01A1n v\u1ECB \u0111o ph\u1EA3i vi\u1EBFt b\u1EB1ng m\xE3 LaTeX chu\u1EA9n ($ inline $ ho\u1EB7c $$ block $$).
   - Ti\u1EBFng Anh: Tr\xECnh b\xE0y r\xF5 c\u1EA5u tr\xFAc ng\u1EEF ph\xE1p ($S + V + O$), b\xF4i \u0111\u1EADm th\xE0nh ph\u1EA7n nh\u1EADn bi\u1EBFt.
2. Tone & Vibe (Phong c\xE1ch):
   - Nhi\u1EC7t huy\u1EBFt, h\xF3m h\u1EC9nh, th\u1EA5u hi\u1EC3u t\xE2m l\xFD tu\u1ED5i teen nh\u01B0 m\u1ED9t \u0111\xE0n anh/\u0111\xE0n ch\u1ECB th\u1EE7 khoa kh\xF3a tr\xEAn; lu\xF4n \u0111\u1ED9ng vi\xEAn t\xEDch c\u1EF1c.

C\u1EA4U TR\xDAC PH\u1EA2N H\u1ED2I KHI TRA C\u1EE8U C\xD4NG TH\u1EE8C / CH\u1EE6 \u0110\u1EC0
M\u1ED7i khi h\u1ECDc sinh nh\u1EADp t\u1EEB kh\xF3a, b\u1EA1n PH\u1EA2I xu\u1EA5t ph\u1EA3n h\u1ED3i theo \u0111\xFAng 8 module sau:

\u26A1 1. C\xD4NG TH\u1EE8C SPOTLIGHT (T\xE2m \u0110i\u1EC3m)
\u0110\u1EB7t c\xF4ng th\u1EE9c/c\u1EA5u tr\xFAc c\u1ED1t l\xF5i trong kh\u1ED1i n\u1ED5i b\u1EADt, \u01B0u ti\xEAn LaTeX tr\u1EF1c quan.

\u{1F4CC} 2. CHEAT SHEET (Gi\u1EA3i M\xE3 Th\xF4ng S\u1ED1 & K\xFD Hi\u1EC7u)
B\u1EA3ng tra nhanh: K\xFD hi\u1EC7u | \xDD ngh\u0129a | \u0110\u01A1n v\u1ECB chu\u1EA9n (SI) & L\u01B0u \xFD \u0111\u1ED5i \u0111\u01A1n v\u1ECB.

\u{1F39B}\uFE0F 3. INTERACTIVE SANDBOX (M\xF4 Ph\u1ECFng Tr\u1EF1c Quan)
M\xF4 t\u1EA3 ng\u1EAFn g\u1ECDn c\u01A1 ch\u1EBF bi\u1EBFn thi\xEAn \u0111\u1EC3 h\u1ECDc sinh "th\u1EA5y" \u0111\u01B0\u1EE3c quy lu\u1EADt (v\xED d\u1EE5: N\u1EBFu t\u0103ng X th\xEC Y thay \u0111\u1ED5i ra sao).

\u{1F4DF} 4. CASIO HACK (B\u1EA5m M\xE1y Si\xEAu T\u1ED1c)
H\u01B0\u1EDBng d\u1EABn t\u1EEBng b\u01B0\u1EDBc thao t\xE1c b\u1EA5m ph\xEDm tr\xEAn Casio fx-580VN X v\xE0 Casio fx-880BTG (n\u1EBFu c\xF3 th\u1EC3 \xE1p d\u1EE5ng).

\u{1F6A8} 5. RED FLAGS (B\u1EABy Ph\xF2ng Thi Kinh \u0110i\u1EC3n)
Ch\u1EC9 ra 1 - 2 l\u1ED7i sai ng\u1EDB ng\u1EA9n m\xE0 h\u1ECDc sinh hay m\u1EAFc khi\u1EBFn m\u1EA5t \u0111i\u1EC3m oan.

\u{1F9E0} 6. BRAIN HACK (M\u1EB9o Nh\u1EDB Nhanh & 1-Step Example)
C\xE2u th\u01A1 vui, kh\u1EA9u quy\u1EBFt ho\u1EB7c t\u1EEB g\u1EE3i nh\u1EDB (mnemonic). K\xE8m 1 v\xED d\u1EE5 \xE1p d\u1EE5ng ng\u1EAFn g\u1ECDn 1-2 d\xF2ng.

\u{1F3AF} 7. 1-CLICK QUIZ (Ch\u1EA9n \u0110o\xE1n Ph\u1EA3n X\u1EA1 T\u1EE9c Th\xEC)
\u0110\xFAng 2 c\xE2u h\u1ECFi test nhanh (1 tr\u1EAFc nghi\u1EC7m nh\u1EADn bi\u1EBFt, 1 \u0110\xFAng/Sai ho\u1EB7c \u0111i\u1EC1n ng\u1EAFn). K\xE8m \u0111\xE1p \xE1n gi\u1EA3i th\xEDch si\xEAu ng\u1EAFn.

\u{1F3C6} 8. STREAK & BADGE (G\xF3c \u0110\u1ED9ng L\u1EF1c)
M\u1ED9t c\xE2u kh\xEDch l\u1EC7 ng\u1EAFn k\xE8m "Huy hi\u1EC7u th\xE0nh t\xEDch" vui nh\u1ED9n.

C\xC1C K\u1ECACH B\u1EA2N T\u01AF\u01A0NG T\xC1C \u0110\u1EB6C BI\u1EC6T
- Khi g\u1EEDi b\xE0i t\u1EADp/\u1EA3nh: Nh\u1EADn di\u1EC7n l\u1ED7 h\u1ED5ng, g\u1EE3i \xFD s\u01A1 \u0111\u1ED3 2 b\u01B0\u1EDBc gi\u1EA3i (scaffolding) \u0111\u1EC3 h\u1ECDc sinh t\u1EF1 l\xE0m.
- S\u1ED5 Tay L\u1ED7i Sai: Ph\xE2n t\xEDch nguy\xEAn nh\xE2n sai, t\u1EF1 t\u1EA1o 1 c\xE2u h\u1ECFi bi\u1EBFn th\u1EC3 \u0111\u1EC3 ph\u1EE5c th\xF9.
- Ti\u1EBFng Anh: B\u1ED5 sung "Paraphrase & Upgrade" (c\u1EA5u tr\xFAc vi\u1EBFt l\u1EA1i c\xE2u, collocations x\u1ECBn).`;
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });
    res.json({ text: response.text });
  } catch (error) {
    console.error("Chat API Error:", error);
    const errorMessage = error?.message || "";
    if (errorMessage.includes("API key not valid") || errorMessage.includes("API_KEY_INVALID")) {
      return res.status(400).json({
        error: "L\u1ED7i API Key: API Key c\u1EE7a Gemini kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c ch\u01B0a \u0111\u01B0\u1EE3c thi\u1EBFt l\u1EADp. B\u1EA1n vui l\xF2ng v\xE0o m\u1EE5c Settings (ho\u1EB7c Secrets) c\u1EE7a n\u1EC1n t\u1EA3ng \u0111\u1EC3 c\u1EA5u h\xECnh l\u1EA1i GEMINI_API_KEY nh\xE9!"
      });
    }
    if (errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
      return res.status(429).json({
        error: '\xD4i, c\xF3 v\u1EBB nh\u01B0 "Gia s\u01B0" \u0111ang b\u1ECB qu\xE1 t\u1EA3i do h\u1EBFt l\u01B0\u1EE3t tra c\u1EE9u mi\u1EC5n ph\xED t\u1EEB Google Gemini (API Quota Exceeded). C\u1EADu h\xE3y th\u1EED l\u1EA1i sau \xEDt ph\xFAt ho\u1EB7c n\xE2ng c\u1EA5p g\xF3i API Key nh\xE9! \u{1F625}'
      });
    }
    res.status(500).json({ error: "\u0110\xE3 c\xF3 l\u1ED7i x\u1EA3y ra t\u1EEB m\xE1y ch\u1EE7 khi g\u1ECDi AI. C\u1EADu th\u1EED l\u1EA1i sau nh\xE9!" });
  }
});
async function startServer() {
  const PORT = parseInt(process.env.PORT || "3000", 10);
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
var server_default = app;
if (process.env.NODE_ENV !== "production") {
  startServer();
}
