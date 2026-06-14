import "./styles.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
let supabase = null;

const app = document.querySelector("#app");

const state = {
  view: "palpitar",
  profile: JSON.parse(localStorage.getItem("palpitao_profile") || "null"),
  teams: [],
  games: [],
  predictions: [],
  profiles: [],
  filters: { grupo: "todos", rodada: "todos", fase: "todos", status: "todos" },
  message: "",
  csv: null,
  selectedPartnerId: localStorage.getItem("palpitao_selected_partner") || null
};

const flagCdn = {
  "BRA": "br",
  "BR": "br",
  "MAR": "ma",
  "MEX": "mx",
  "CAN": "ca",
  "USA": "us",
  "EUA": "us",
  "URU": "uy",
  "RSA": "za",
  "KOR": "kr",
  "CZE": "cz",
  "BIH": "ba",
  "QAT": "qa",
  "SUI": "ch",
  "SCO": "gb-sct",
  "HAI": "ht",
  "AUS": "au",
  "PAR": "py",
  "TUR": "tr",
  "GER": "de",
  "ALE": "de",
  "CIV": "ci",
  "CUW": "cw",
  "ECU": "ec",
  "NED": "nl",
  "HOL": "nl",
  "JPN": "jp",
  "SWE": "se",
  "BEL": "be",
  "EGY": "eg",
  "IRN": "ir",
  "NZL": "nz",
  "KSA": "sa",
  "CPV": "cv",
  "ESP": "es",
  "FRA": "fr",
  "IRQ": "iq",
  "NOR": "no",
  "SEN": "sn",
  "ARG": "ar",
  "ALG": "dz",
  "DZA": "dz",
  "JOR": "jo",
  "AUT": "at",
  "COL": "co",
  "POR": "pt",
  "COD": "cd",
  "UZB": "uz",
  "CRO": "hr",
  "GHA": "gh",
  "ENG": "gb-eng",
  "PAN": "pa",
  "TUN": "tn"
};

const DATA_VERSION = "2026_FULL_GROUPS_V9_6_HEADER_LAYOUT_FIX";

const groupOrder = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

const seed = {
  "version": "2026_FULL_GROUPS_V6_LOGIN",
  "profiles": [
    {
      "id": "00000000-0000-0000-0000-000000000001",
      "nome": "César Camargo",
      "apelido": "César",
      "email": "cesar@example.com",
      "role": "admin",
      "senha": "admin123",
      "ativo": true
    },
    {
      "id": "00000000-0000-0000-0000-000000000002",
      "nome": "Ana Souza",
      "apelido": "Ana",
      "email": "ana@example.com",
      "role": "participante",
      "senha": "1234",
      "ativo": true
    },
    {
      "id": "00000000-0000-0000-0000-000000000003",
      "nome": "João Lima",
      "apelido": "João",
      "email": "joao@example.com",
      "role": "participante",
      "senha": "1234",
      "ativo": true
    }
  ],
  "teams": [
    {
      "id": "team-kor",
      "nome": "Coreia do Sul",
      "codigo": "KOR",
      "flag_url": "https://flagcdn.com/w80/kr.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "A"
    },
    {
      "id": "team-mex",
      "nome": "México",
      "codigo": "MEX",
      "flag_url": "https://flagcdn.com/w80/mx.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "A"
    },
    {
      "id": "team-cze",
      "nome": "Tchéquia",
      "codigo": "CZE",
      "flag_url": "https://flagcdn.com/w80/cz.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "A"
    },
    {
      "id": "team-rsa",
      "nome": "África do Sul",
      "codigo": "RSA",
      "flag_url": "https://flagcdn.com/w80/za.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "A"
    },
    {
      "id": "team-bih",
      "nome": "Bósnia e Herzegovina",
      "codigo": "BIH",
      "flag_url": "https://flagcdn.com/w80/ba.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "B"
    },
    {
      "id": "team-can",
      "nome": "Canadá",
      "codigo": "CAN",
      "flag_url": "https://flagcdn.com/w80/ca.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "B"
    },
    {
      "id": "team-qat",
      "nome": "Catar",
      "codigo": "QAT",
      "flag_url": "https://flagcdn.com/w80/qa.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "B"
    },
    {
      "id": "team-sui",
      "nome": "Suíça",
      "codigo": "SUI",
      "flag_url": "https://flagcdn.com/w80/ch.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "B"
    },
    {
      "id": "team-bra",
      "nome": "Brasil",
      "codigo": "BRA",
      "flag_url": "https://flagcdn.com/w80/br.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "C"
    },
    {
      "id": "team-sco",
      "nome": "Escócia",
      "codigo": "SCO",
      "flag_url": "https://flagcdn.com/w80/gb-sct.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "C"
    },
    {
      "id": "team-hai",
      "nome": "Haiti",
      "codigo": "HAI",
      "flag_url": "https://flagcdn.com/w80/ht.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "C"
    },
    {
      "id": "team-mar",
      "nome": "Marrocos",
      "codigo": "MAR",
      "flag_url": "https://flagcdn.com/w80/ma.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "C"
    },
    {
      "id": "team-aus",
      "nome": "Austrália",
      "codigo": "AUS",
      "flag_url": "https://flagcdn.com/w80/au.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "D"
    },
    {
      "id": "team-usa",
      "nome": "Estados Unidos",
      "codigo": "USA",
      "flag_url": "https://flagcdn.com/w80/us.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "D"
    },
    {
      "id": "team-par",
      "nome": "Paraguai",
      "codigo": "PAR",
      "flag_url": "https://flagcdn.com/w80/py.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "D"
    },
    {
      "id": "team-tur",
      "nome": "Turquia",
      "codigo": "TUR",
      "flag_url": "https://flagcdn.com/w80/tr.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "D"
    },
    {
      "id": "team-ger",
      "nome": "Alemanha",
      "codigo": "GER",
      "flag_url": "https://flagcdn.com/w80/de.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "E"
    },
    {
      "id": "team-civ",
      "nome": "Costa do Marfim",
      "codigo": "CIV",
      "flag_url": "https://flagcdn.com/w80/ci.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "E"
    },
    {
      "id": "team-cuw",
      "nome": "Curaçao",
      "codigo": "CUW",
      "flag_url": "https://flagcdn.com/w80/cw.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "E"
    },
    {
      "id": "team-ecu",
      "nome": "Equador",
      "codigo": "ECU",
      "flag_url": "https://flagcdn.com/w80/ec.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "E"
    },
    {
      "id": "team-ned",
      "nome": "Holanda",
      "codigo": "NED",
      "flag_url": "https://flagcdn.com/w80/nl.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "F"
    },
    {
      "id": "team-jpn",
      "nome": "Japão",
      "codigo": "JPN",
      "flag_url": "https://flagcdn.com/w80/jp.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "F"
    },
    {
      "id": "team-swe",
      "nome": "Suécia",
      "codigo": "SWE",
      "flag_url": "https://flagcdn.com/w80/se.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "F"
    },
    {
      "id": "team-tun",
      "nome": "Tunísia",
      "codigo": "TUN",
      "flag_url": "https://flagcdn.com/w80/tn.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "F"
    },
    {
      "id": "team-bel",
      "nome": "Bélgica",
      "codigo": "BEL",
      "flag_url": "https://flagcdn.com/w80/be.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "G"
    },
    {
      "id": "team-egy",
      "nome": "Egito",
      "codigo": "EGY",
      "flag_url": "https://flagcdn.com/w80/eg.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "G"
    },
    {
      "id": "team-irn",
      "nome": "Irã",
      "codigo": "IRN",
      "flag_url": "https://flagcdn.com/w80/ir.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "G"
    },
    {
      "id": "team-nzl",
      "nome": "Nova Zelândia",
      "codigo": "NZL",
      "flag_url": "https://flagcdn.com/w80/nz.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "G"
    },
    {
      "id": "team-ksa",
      "nome": "Arábia Saudita",
      "codigo": "KSA",
      "flag_url": "https://flagcdn.com/w80/sa.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "H"
    },
    {
      "id": "team-cpv",
      "nome": "Cabo Verde",
      "codigo": "CPV",
      "flag_url": "https://flagcdn.com/w80/cv.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "H"
    },
    {
      "id": "team-esp",
      "nome": "Espanha",
      "codigo": "ESP",
      "flag_url": "https://flagcdn.com/w80/es.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "H"
    },
    {
      "id": "team-uru",
      "nome": "Uruguai",
      "codigo": "URU",
      "flag_url": "https://flagcdn.com/w80/uy.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "H"
    },
    {
      "id": "team-fra",
      "nome": "França",
      "codigo": "FRA",
      "flag_url": "https://flagcdn.com/w80/fr.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "I"
    },
    {
      "id": "team-irq",
      "nome": "Iraque",
      "codigo": "IRQ",
      "flag_url": "https://flagcdn.com/w80/iq.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "I"
    },
    {
      "id": "team-nor",
      "nome": "Noruega",
      "codigo": "NOR",
      "flag_url": "https://flagcdn.com/w80/no.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "I"
    },
    {
      "id": "team-sen",
      "nome": "Senegal",
      "codigo": "SEN",
      "flag_url": "https://flagcdn.com/w80/sn.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "I"
    },
    {
      "id": "team-arg",
      "nome": "Argentina",
      "codigo": "ARG",
      "flag_url": "https://flagcdn.com/w80/ar.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "J"
    },
    {
      "id": "team-alg",
      "nome": "Argélia",
      "codigo": "ALG",
      "flag_url": "https://flagcdn.com/w80/dz.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "J"
    },
    {
      "id": "team-jor",
      "nome": "Jordânia",
      "codigo": "JOR",
      "flag_url": "https://flagcdn.com/w80/jo.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "J"
    },
    {
      "id": "team-aut",
      "nome": "Áustria",
      "codigo": "AUT",
      "flag_url": "https://flagcdn.com/w80/at.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "J"
    },
    {
      "id": "team-col",
      "nome": "Colômbia",
      "codigo": "COL",
      "flag_url": "https://flagcdn.com/w80/co.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "K"
    },
    {
      "id": "team-por",
      "nome": "Portugal",
      "codigo": "POR",
      "flag_url": "https://flagcdn.com/w80/pt.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "K"
    },
    {
      "id": "team-cod",
      "nome": "RD Congo",
      "codigo": "COD",
      "flag_url": "https://flagcdn.com/w80/cd.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "K"
    },
    {
      "id": "team-uzb",
      "nome": "Uzbequistão",
      "codigo": "UZB",
      "flag_url": "https://flagcdn.com/w80/uz.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "K"
    },
    {
      "id": "team-cro",
      "nome": "Croácia",
      "codigo": "CRO",
      "flag_url": "https://flagcdn.com/w80/hr.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "L"
    },
    {
      "id": "team-gha",
      "nome": "Gana",
      "codigo": "GHA",
      "flag_url": "https://flagcdn.com/w80/gh.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "L"
    },
    {
      "id": "team-eng",
      "nome": "Inglaterra",
      "codigo": "ENG",
      "flag_url": "https://flagcdn.com/w80/gb-eng.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "L"
    },
    {
      "id": "team-pan",
      "nome": "Panamá",
      "codigo": "PAN",
      "flag_url": "https://flagcdn.com/w80/pa.png",
      "continente": "",
      "ativo": true,
      "grupo_atual": "L"
    }
  ],
  "games": [
    {
      "id": "game-001",
      "codigo_jogo": "G01",
      "fase": "GRUPOS",
      "grupo": "A",
      "rodada": 1,
      "data_hora": "2026-06-11T16:00:00-03:00",
      "time_a_id": "team-mex",
      "time_b_id": "team-rsa",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-002",
      "codigo_jogo": "G02",
      "fase": "GRUPOS",
      "grupo": "A",
      "rodada": 1,
      "data_hora": "2026-06-11T23:00:00-03:00",
      "time_a_id": "team-kor",
      "time_b_id": "team-cze",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-003",
      "codigo_jogo": "G03",
      "fase": "GRUPOS",
      "grupo": "B",
      "rodada": 1,
      "data_hora": "2026-06-12T16:00:00-03:00",
      "time_a_id": "team-can",
      "time_b_id": "team-bih",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-004",
      "codigo_jogo": "G04",
      "fase": "GRUPOS",
      "grupo": "D",
      "rodada": 1,
      "data_hora": "2026-06-12T22:00:00-03:00",
      "time_a_id": "team-usa",
      "time_b_id": "team-par",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-005",
      "codigo_jogo": "G05",
      "fase": "GRUPOS",
      "grupo": "B",
      "rodada": 1,
      "data_hora": "2026-06-13T16:00:00-03:00",
      "time_a_id": "team-qat",
      "time_b_id": "team-sui",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-006",
      "codigo_jogo": "G06",
      "fase": "GRUPOS",
      "grupo": "C",
      "rodada": 1,
      "data_hora": "2026-06-13T19:00:00-03:00",
      "time_a_id": "team-bra",
      "time_b_id": "team-mar",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-007",
      "codigo_jogo": "G07",
      "fase": "GRUPOS",
      "grupo": "C",
      "rodada": 1,
      "data_hora": "2026-06-13T22:00:00-03:00",
      "time_a_id": "team-hai",
      "time_b_id": "team-sco",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-008",
      "codigo_jogo": "G08",
      "fase": "GRUPOS",
      "grupo": "D",
      "rodada": 1,
      "data_hora": "2026-06-14T01:00:00-03:00",
      "time_a_id": "team-aus",
      "time_b_id": "team-tur",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-009",
      "codigo_jogo": "G09",
      "fase": "GRUPOS",
      "grupo": "E",
      "rodada": 1,
      "data_hora": "2026-06-14T14:00:00-03:00",
      "time_a_id": "team-ger",
      "time_b_id": "team-cuw",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-010",
      "codigo_jogo": "G10",
      "fase": "GRUPOS",
      "grupo": "F",
      "rodada": 1,
      "data_hora": "2026-06-14T17:00:00-03:00",
      "time_a_id": "team-ned",
      "time_b_id": "team-jpn",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-011",
      "codigo_jogo": "G11",
      "fase": "GRUPOS",
      "grupo": "E",
      "rodada": 1,
      "data_hora": "2026-06-14T20:00:00-03:00",
      "time_a_id": "team-civ",
      "time_b_id": "team-ecu",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-012",
      "codigo_jogo": "G12",
      "fase": "GRUPOS",
      "grupo": "F",
      "rodada": 1,
      "data_hora": "2026-06-14T23:00:00-03:00",
      "time_a_id": "team-swe",
      "time_b_id": "team-tun",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-013",
      "codigo_jogo": "G13",
      "fase": "GRUPOS",
      "grupo": "H",
      "rodada": 1,
      "data_hora": "2026-06-15T13:00:00-03:00",
      "time_a_id": "team-esp",
      "time_b_id": "team-cpv",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-014",
      "codigo_jogo": "G14",
      "fase": "GRUPOS",
      "grupo": "G",
      "rodada": 1,
      "data_hora": "2026-06-15T16:00:00-03:00",
      "time_a_id": "team-bel",
      "time_b_id": "team-egy",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-015",
      "codigo_jogo": "G15",
      "fase": "GRUPOS",
      "grupo": "H",
      "rodada": 1,
      "data_hora": "2026-06-15T19:00:00-03:00",
      "time_a_id": "team-ksa",
      "time_b_id": "team-uru",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-016",
      "codigo_jogo": "G16",
      "fase": "GRUPOS",
      "grupo": "G",
      "rodada": 1,
      "data_hora": "2026-06-15T22:00:00-03:00",
      "time_a_id": "team-irn",
      "time_b_id": "team-nzl",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-017",
      "codigo_jogo": "G17",
      "fase": "GRUPOS",
      "grupo": "I",
      "rodada": 1,
      "data_hora": "2026-06-16T16:00:00-03:00",
      "time_a_id": "team-fra",
      "time_b_id": "team-sen",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-018",
      "codigo_jogo": "G18",
      "fase": "GRUPOS",
      "grupo": "I",
      "rodada": 1,
      "data_hora": "2026-06-16T19:00:00-03:00",
      "time_a_id": "team-irq",
      "time_b_id": "team-nor",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-019",
      "codigo_jogo": "G19",
      "fase": "GRUPOS",
      "grupo": "J",
      "rodada": 1,
      "data_hora": "2026-06-16T22:00:00-03:00",
      "time_a_id": "team-arg",
      "time_b_id": "team-alg",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-020",
      "codigo_jogo": "G20",
      "fase": "GRUPOS",
      "grupo": "J",
      "rodada": 1,
      "data_hora": "2026-06-17T01:00:00-03:00",
      "time_a_id": "team-aut",
      "time_b_id": "team-jor",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-021",
      "codigo_jogo": "G21",
      "fase": "GRUPOS",
      "grupo": "K",
      "rodada": 1,
      "data_hora": "2026-06-17T14:00:00-03:00",
      "time_a_id": "team-por",
      "time_b_id": "team-cod",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-022",
      "codigo_jogo": "G22",
      "fase": "GRUPOS",
      "grupo": "L",
      "rodada": 1,
      "data_hora": "2026-06-17T17:00:00-03:00",
      "time_a_id": "team-eng",
      "time_b_id": "team-cro",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-023",
      "codigo_jogo": "G23",
      "fase": "GRUPOS",
      "grupo": "L",
      "rodada": 1,
      "data_hora": "2026-06-17T20:00:00-03:00",
      "time_a_id": "team-gha",
      "time_b_id": "team-pan",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-024",
      "codigo_jogo": "G24",
      "fase": "GRUPOS",
      "grupo": "K",
      "rodada": 1,
      "data_hora": "2026-06-17T23:00:00-03:00",
      "time_a_id": "team-uzb",
      "time_b_id": "team-col",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-025",
      "codigo_jogo": "G25",
      "fase": "GRUPOS",
      "grupo": "A",
      "rodada": 2,
      "data_hora": "2026-06-18T13:00:00-03:00",
      "time_a_id": "team-cze",
      "time_b_id": "team-rsa",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-026",
      "codigo_jogo": "G26",
      "fase": "GRUPOS",
      "grupo": "B",
      "rodada": 2,
      "data_hora": "2026-06-18T16:00:00-03:00",
      "time_a_id": "team-sui",
      "time_b_id": "team-bih",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-027",
      "codigo_jogo": "G27",
      "fase": "GRUPOS",
      "grupo": "B",
      "rodada": 2,
      "data_hora": "2026-06-18T19:00:00-03:00",
      "time_a_id": "team-can",
      "time_b_id": "team-qat",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-028",
      "codigo_jogo": "G28",
      "fase": "GRUPOS",
      "grupo": "A",
      "rodada": 2,
      "data_hora": "2026-06-18T22:00:00-03:00",
      "time_a_id": "team-mex",
      "time_b_id": "team-kor",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-029",
      "codigo_jogo": "G29",
      "fase": "GRUPOS",
      "grupo": "D",
      "rodada": 2,
      "data_hora": "2026-06-19T16:00:00-03:00",
      "time_a_id": "team-usa",
      "time_b_id": "team-aus",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-030",
      "codigo_jogo": "G30",
      "fase": "GRUPOS",
      "grupo": "C",
      "rodada": 2,
      "data_hora": "2026-06-19T19:00:00-03:00",
      "time_a_id": "team-sco",
      "time_b_id": "team-mar",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-031",
      "codigo_jogo": "G31",
      "fase": "GRUPOS",
      "grupo": "C",
      "rodada": 2,
      "data_hora": "2026-06-19T21:30:00-03:00",
      "time_a_id": "team-bra",
      "time_b_id": "team-hai",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-032",
      "codigo_jogo": "G32",
      "fase": "GRUPOS",
      "grupo": "D",
      "rodada": 2,
      "data_hora": "2026-06-20T00:00:00-03:00",
      "time_a_id": "team-tur",
      "time_b_id": "team-par",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-033",
      "codigo_jogo": "G33",
      "fase": "GRUPOS",
      "grupo": "F",
      "rodada": 2,
      "data_hora": "2026-06-20T14:00:00-03:00",
      "time_a_id": "team-ned",
      "time_b_id": "team-swe",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-034",
      "codigo_jogo": "G34",
      "fase": "GRUPOS",
      "grupo": "E",
      "rodada": 2,
      "data_hora": "2026-06-20T17:00:00-03:00",
      "time_a_id": "team-ger",
      "time_b_id": "team-civ",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-035",
      "codigo_jogo": "G35",
      "fase": "GRUPOS",
      "grupo": "E",
      "rodada": 2,
      "data_hora": "2026-06-20T21:00:00-03:00",
      "time_a_id": "team-ecu",
      "time_b_id": "team-cuw",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-036",
      "codigo_jogo": "G36",
      "fase": "GRUPOS",
      "grupo": "F",
      "rodada": 2,
      "data_hora": "2026-06-21T01:00:00-03:00",
      "time_a_id": "team-tun",
      "time_b_id": "team-jpn",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-037",
      "codigo_jogo": "G37",
      "fase": "GRUPOS",
      "grupo": "H",
      "rodada": 2,
      "data_hora": "2026-06-21T13:00:00-03:00",
      "time_a_id": "team-esp",
      "time_b_id": "team-ksa",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-038",
      "codigo_jogo": "G38",
      "fase": "GRUPOS",
      "grupo": "G",
      "rodada": 2,
      "data_hora": "2026-06-21T16:00:00-03:00",
      "time_a_id": "team-bel",
      "time_b_id": "team-irn",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-039",
      "codigo_jogo": "G39",
      "fase": "GRUPOS",
      "grupo": "H",
      "rodada": 2,
      "data_hora": "2026-06-21T19:00:00-03:00",
      "time_a_id": "team-uru",
      "time_b_id": "team-cpv",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-040",
      "codigo_jogo": "G40",
      "fase": "GRUPOS",
      "grupo": "G",
      "rodada": 2,
      "data_hora": "2026-06-21T22:00:00-03:00",
      "time_a_id": "team-nzl",
      "time_b_id": "team-egy",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-041",
      "codigo_jogo": "G41",
      "fase": "GRUPOS",
      "grupo": "J",
      "rodada": 2,
      "data_hora": "2026-06-22T14:00:00-03:00",
      "time_a_id": "team-arg",
      "time_b_id": "team-aut",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-042",
      "codigo_jogo": "G42",
      "fase": "GRUPOS",
      "grupo": "I",
      "rodada": 2,
      "data_hora": "2026-06-22T18:00:00-03:00",
      "time_a_id": "team-fra",
      "time_b_id": "team-irq",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-043",
      "codigo_jogo": "G43",
      "fase": "GRUPOS",
      "grupo": "I",
      "rodada": 2,
      "data_hora": "2026-06-22T21:00:00-03:00",
      "time_a_id": "team-nor",
      "time_b_id": "team-sen",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-044",
      "codigo_jogo": "G44",
      "fase": "GRUPOS",
      "grupo": "J",
      "rodada": 2,
      "data_hora": "2026-06-23T00:00:00-03:00",
      "time_a_id": "team-jor",
      "time_b_id": "team-alg",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-045",
      "codigo_jogo": "G45",
      "fase": "GRUPOS",
      "grupo": "K",
      "rodada": 2,
      "data_hora": "2026-06-23T14:00:00-03:00",
      "time_a_id": "team-por",
      "time_b_id": "team-uzb",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-046",
      "codigo_jogo": "G46",
      "fase": "GRUPOS",
      "grupo": "L",
      "rodada": 2,
      "data_hora": "2026-06-23T17:00:00-03:00",
      "time_a_id": "team-eng",
      "time_b_id": "team-gha",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-047",
      "codigo_jogo": "G47",
      "fase": "GRUPOS",
      "grupo": "L",
      "rodada": 2,
      "data_hora": "2026-06-23T20:00:00-03:00",
      "time_a_id": "team-pan",
      "time_b_id": "team-cro",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-048",
      "codigo_jogo": "G48",
      "fase": "GRUPOS",
      "grupo": "K",
      "rodada": 2,
      "data_hora": "2026-06-23T23:00:00-03:00",
      "time_a_id": "team-col",
      "time_b_id": "team-cod",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-049",
      "codigo_jogo": "G49",
      "fase": "GRUPOS",
      "grupo": "B",
      "rodada": 3,
      "data_hora": "2026-06-24T16:00:00-03:00",
      "time_a_id": "team-sui",
      "time_b_id": "team-can",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-050",
      "codigo_jogo": "G50",
      "fase": "GRUPOS",
      "grupo": "B",
      "rodada": 3,
      "data_hora": "2026-06-24T16:00:00-03:00",
      "time_a_id": "team-bih",
      "time_b_id": "team-qat",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-051",
      "codigo_jogo": "G51",
      "fase": "GRUPOS",
      "grupo": "C",
      "rodada": 3,
      "data_hora": "2026-06-24T19:00:00-03:00",
      "time_a_id": "team-mar",
      "time_b_id": "team-hai",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-052",
      "codigo_jogo": "G52",
      "fase": "GRUPOS",
      "grupo": "C",
      "rodada": 3,
      "data_hora": "2026-06-24T19:00:00-03:00",
      "time_a_id": "team-sco",
      "time_b_id": "team-bra",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-053",
      "codigo_jogo": "G53",
      "fase": "GRUPOS",
      "grupo": "A",
      "rodada": 3,
      "data_hora": "2026-06-24T22:00:00-03:00",
      "time_a_id": "team-rsa",
      "time_b_id": "team-kor",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-054",
      "codigo_jogo": "G54",
      "fase": "GRUPOS",
      "grupo": "A",
      "rodada": 3,
      "data_hora": "2026-06-24T22:00:00-03:00",
      "time_a_id": "team-cze",
      "time_b_id": "team-mex",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-055",
      "codigo_jogo": "G55",
      "fase": "GRUPOS",
      "grupo": "E",
      "rodada": 3,
      "data_hora": "2026-06-25T17:00:00-03:00",
      "time_a_id": "team-cuw",
      "time_b_id": "team-civ",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-056",
      "codigo_jogo": "G56",
      "fase": "GRUPOS",
      "grupo": "E",
      "rodada": 3,
      "data_hora": "2026-06-25T17:00:00-03:00",
      "time_a_id": "team-ecu",
      "time_b_id": "team-ger",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-057",
      "codigo_jogo": "G57",
      "fase": "GRUPOS",
      "grupo": "F",
      "rodada": 3,
      "data_hora": "2026-06-25T20:00:00-03:00",
      "time_a_id": "team-tun",
      "time_b_id": "team-ned",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-058",
      "codigo_jogo": "G58",
      "fase": "GRUPOS",
      "grupo": "F",
      "rodada": 3,
      "data_hora": "2026-06-25T20:00:00-03:00",
      "time_a_id": "team-jpn",
      "time_b_id": "team-swe",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-059",
      "codigo_jogo": "G59",
      "fase": "GRUPOS",
      "grupo": "D",
      "rodada": 3,
      "data_hora": "2026-06-25T23:00:00-03:00",
      "time_a_id": "team-tur",
      "time_b_id": "team-usa",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-060",
      "codigo_jogo": "G60",
      "fase": "GRUPOS",
      "grupo": "D",
      "rodada": 3,
      "data_hora": "2026-06-25T23:00:00-03:00",
      "time_a_id": "team-par",
      "time_b_id": "team-aus",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-061",
      "codigo_jogo": "G61",
      "fase": "GRUPOS",
      "grupo": "I",
      "rodada": 3,
      "data_hora": "2026-06-26T16:00:00-03:00",
      "time_a_id": "team-nor",
      "time_b_id": "team-fra",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-062",
      "codigo_jogo": "G62",
      "fase": "GRUPOS",
      "grupo": "I",
      "rodada": 3,
      "data_hora": "2026-06-26T16:00:00-03:00",
      "time_a_id": "team-sen",
      "time_b_id": "team-irq",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-063",
      "codigo_jogo": "G63",
      "fase": "GRUPOS",
      "grupo": "H",
      "rodada": 3,
      "data_hora": "2026-06-26T21:00:00-03:00",
      "time_a_id": "team-cpv",
      "time_b_id": "team-ksa",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-064",
      "codigo_jogo": "G64",
      "fase": "GRUPOS",
      "grupo": "H",
      "rodada": 3,
      "data_hora": "2026-06-26T21:00:00-03:00",
      "time_a_id": "team-uru",
      "time_b_id": "team-esp",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-065",
      "codigo_jogo": "G65",
      "fase": "GRUPOS",
      "grupo": "G",
      "rodada": 3,
      "data_hora": "2026-06-27T00:00:00-03:00",
      "time_a_id": "team-nzl",
      "time_b_id": "team-bel",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-066",
      "codigo_jogo": "G66",
      "fase": "GRUPOS",
      "grupo": "G",
      "rodada": 3,
      "data_hora": "2026-06-27T00:00:00-03:00",
      "time_a_id": "team-egy",
      "time_b_id": "team-irn",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-067",
      "codigo_jogo": "G67",
      "fase": "GRUPOS",
      "grupo": "L",
      "rodada": 3,
      "data_hora": "2026-06-27T18:00:00-03:00",
      "time_a_id": "team-pan",
      "time_b_id": "team-eng",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-068",
      "codigo_jogo": "G68",
      "fase": "GRUPOS",
      "grupo": "L",
      "rodada": 3,
      "data_hora": "2026-06-27T18:00:00-03:00",
      "time_a_id": "team-cro",
      "time_b_id": "team-gha",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-069",
      "codigo_jogo": "G69",
      "fase": "GRUPOS",
      "grupo": "K",
      "rodada": 3,
      "data_hora": "2026-06-27T20:30:00-03:00",
      "time_a_id": "team-col",
      "time_b_id": "team-por",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-070",
      "codigo_jogo": "G70",
      "fase": "GRUPOS",
      "grupo": "K",
      "rodada": 3,
      "data_hora": "2026-06-27T20:30:00-03:00",
      "time_a_id": "team-cod",
      "time_b_id": "team-uzb",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-071",
      "codigo_jogo": "G71",
      "fase": "GRUPOS",
      "grupo": "J",
      "rodada": 3,
      "data_hora": "2026-06-27T23:00:00-03:00",
      "time_a_id": "team-alg",
      "time_b_id": "team-aut",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    },
    {
      "id": "game-072",
      "codigo_jogo": "G72",
      "fase": "GRUPOS",
      "grupo": "J",
      "rodada": 3,
      "data_hora": "2026-06-27T23:00:00-03:00",
      "time_a_id": "team-jor",
      "time_b_id": "team-arg",
      "gols_a": null,
      "gols_b": null,
      "status": "aberto"
    }
  ],
  "predictions": []
};

function saveLocal() {
  localStorage.setItem("palpitao_data", JSON.stringify({
    version: DATA_VERSION,
    profiles: state.profiles,
    teams: state.teams,
    games: state.games,
    predictions: state.predictions
  }));
  localStorage.setItem("palpitao_profile", JSON.stringify(state.profile));
}

function loadLocal() {
  const cached = JSON.parse(localStorage.getItem("palpitao_data") || "null");
  const data = cached?.version === DATA_VERSION ? cached : seed;
  state.profiles = data.profiles || [];
  state.teams = data.teams || [];
  state.games = data.games || [];
  state.predictions = data.predictions || [];
}

async function loadData() {
  loadLocal();

  if (!supabase) {
    state.message = "Modo demonstração local. Configure o Supabase para usar o banco real.";
    render();
    return;
  }

  const [profiles, teams, games, predictions] = await Promise.all([
    supabase.from("profiles").select("*").order("nome"),
    supabase.from("teams").select("*").order("nome"),
    supabase.from("games").select("*").order("data_hora"),
    supabase.from("predictions").select("*")
  ]);

  if (profiles.error || teams.error || games.error || predictions.error) {
    state.message = "Não foi possível carregar do Supabase. Mostrando dados locais de demonstração.";
    render();
    return;
  }

  state.profiles = profiles.data.map(normalizeLoadedProfile);
  state.teams = teams.data;
  state.games = games.data;
  state.predictions = predictions.data;
  state.message = "";
  render();
}


function normalizeRole(value) {
  const text = normalizeText(value);
  if (["admin", "adm", "administrador", "administradora"].includes(text)) return "admin";
  return "participante";
}

function normalizeLoadedProfile(profile) {
  return {
    id: String(profile?.id || ""),
    nome: profile?.nome || profile?.apelido || profile?.email || "Palpiteiro",
    apelido: profile?.apelido || profile?.nome || profile?.email || "Palpiteiro",
    email: profile?.email || "",
    whatsapp: profile?.whatsapp || profile?.WhatsApp || "",
    role: normalizeRole(profile?.role || profile?.papel || profile?.funcao || profile?.função || "participante"),
    senha: profile?.senha || "1234",
    ativo: profile?.ativo !== false,
    created_at: profile?.created_at || null
  };
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function initials(value) {
  const words = String(value || "P")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return "P";

  const first = words[0]?.[0] || "P";
  const second = words.length > 1 ? words[words.length - 1]?.[0] : "";
  return `${first}${second}`.toUpperCase();
}

function formatPhase(value) {
  const map = {
    GRUPOS: "Grupos",
    "16_AVOS": "16 avos",
    OITAVAS: "Oitavas",
    QUARTAS: "Quartas",
    SEMIFINAL: "Semifinal",
    TERCEIRO_LUGAR: "3º lugar",
    FINAL: "Final"
  };
  return map[value] || value || "Fase";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function team(id) {
  return state.teams.find((item) => item.id === id) || { nome: "A definir", codigo: "TBD", flag_url: "" };
}

function flagUrl(item) {
  if (item.flag_url) return item.flag_url;
  const country = flagCdn[String(item.codigo || "").toUpperCase()];
  return country ? `https://flagcdn.com/w80/${country}.png` : "";
}

function flag(item) {
  const src = flagUrl(item);
  const alt = `Bandeira ${item.nome}`;
  return `
    <span class="flag" title="${alt}">
      ${src ? `<img src="${src}" alt="${alt}" loading="lazy" onerror="this.parentElement.classList.add('fallback'); this.remove(); this.parentElement.textContent='${item.codigo || "?"}';">` : `<span>${item.codigo || "?"}</span>`}
    </span>
  `;
}

function isLocked(game) {
  return Date.now() >= new Date(game.data_hora).getTime();
}

function gameStatus(game) {
  if (game.status === "apurado") return "apurado";
  if (game.gols_a !== null && game.gols_b !== null) return "encerrado";
  return isLocked(game) ? "fechado" : "aberto";
}

function predictionFor(gameId, userId = state.profile?.id) {
  return state.predictions.find((item) => item.game_id === gameId && item.user_id === userId);
}

function scorePrediction(prediction, game) {
  if (game.gols_a === null || game.gols_b === null) return { ...prediction, acertou: null, pontos: 0 };
  const acertou = Number(prediction.gols_a_palpite) === Number(game.gols_a) && Number(prediction.gols_b_palpite) === Number(game.gols_b);
  return { ...prediction, acertou, pontos: acertou ? 1 : 0 };
}

function computedPredictionScore(prediction, game = null) {
  const targetGame = game || state.games.find((item) => item.id === prediction?.game_id);
  if (!prediction || !targetGame || targetGame.gols_a === null || targetGame.gols_b === null) {
    return { acertou: null, pontos: 0 };
  }

  const acertou =
    Number(prediction.gols_a_palpite) === Number(targetGame.gols_a) &&
    Number(prediction.gols_b_palpite) === Number(targetGame.gols_b);

  return { acertou, pontos: acertou ? 1 : 0 };
}

async function upsertPrediction(gameId) {
  const game = state.games.find((item) => item.id === gameId);
  if (!state.profile) {
    state.message = "Escolha um palpiteiro antes de salvar.";
    render();
    return;
  }
  if (isLocked(game)) {
    state.message = "Palpite encerrado — partida iniciada.";
    render();
    return;
  }

  const a = Number(document.querySelector(`#pa-${gameId}`).value);
  const b = Number(document.querySelector(`#pb-${gameId}`).value);
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0) {
    state.message = "Informe placares válidos, com gols iguais ou maiores que zero.";
    render();
    return;
  }

  const current = predictionFor(gameId);
  const payload = scorePrediction({
    id: current?.id || crypto.randomUUID(),
    user_id: state.profile.id,
    game_id: gameId,
    gols_a_palpite: a,
    gols_b_palpite: b,
    pontos: 0,
    acertou: null
  }, game);

  let supabaseWarning = "";
  if (supabase) {
    const { error } = await supabase.from("predictions").upsert(payload, { onConflict: "user_id,game_id" });
    if (error) {
      supabaseWarning = ` Atenção: não gravou no Supabase (${error.message}). Salvou apenas localmente neste navegador.`;
    }
  }

  state.predictions = state.predictions.filter((item) => !(item.user_id === payload.user_id && item.game_id === payload.game_id));
  state.predictions.push(payload);
  state.message = `Palpite salvo. Boa sorte!${supabaseWarning}`;
  saveLocal();
  render();
}

function filteredGames() {
  return state.games
    .filter((game) => state.filters.grupo === "todos" || game.grupo === state.filters.grupo)
    .filter((game) => state.filters.rodada === "todos" || String(game.rodada) === state.filters.rodada)
    .filter((game) => state.filters.fase === "todos" || game.fase === state.filters.fase)
    .filter((game) => state.filters.status === "todos" || gameStatus(game) === state.filters.status)
    .sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora));
}

function renderScoreInput(game, code, side, value, locked) {
  const id = side === "a" ? `pa-${game.id}` : `pb-${game.id}`;
  return `
    <label class="score-input">
      <span>${code}</span>
      <input id="${id}" type="number" min="0" inputmode="numeric" value="${value ?? ""}" ${locked ? "disabled" : ""}>
    </label>
  `;
}

function renderGameCard(game, mode = "predict") {
  const a = team(game.time_a_id);
  const b = team(game.time_b_id);
  const prediction = predictionFor(game.id);
  const locked = isLocked(game);
  const status = gameStatus(game);
  const officialScore = game.gols_a === null || game.gols_b === null ? "x" : `${game.gols_a} x ${game.gols_b}`;
  const scoreView = prediction ? computedPredictionScore(prediction, game) : { acertou: null, pontos: 0 };
  const result = scoreView.acertou === true
    ? "✅ Cravou! +1 ponto."
    : scoreView.acertou === false
      ? "❌ Não foi dessa vez."
      : prediction
        ? `Seu palpite: ${prediction.gols_a_palpite} x ${prediction.gols_b_palpite}`
        : "Sem palpite ainda";

  return `
    <article class="game-card status-${status}">
      <div class="game-card__top">
        <div class="chips">
          <span>${formatPhase(game.fase)}</span>
          ${game.grupo ? `<span>Grupo ${game.grupo}</span>` : ""}
          <span>Rodada ${game.rodada || "-"}</span>
        </div>
        <span class="status ${status}">${status}</span>
      </div>

      <div class="match-line">
        <div class="team-box">
          ${flag(a)}
          <strong>${a.nome}</strong>
          <small>${a.codigo}</small>
        </div>
        <div class="official-score">
          <span>${officialScore}</span>
          <small>oficial</small>
        </div>
        <div class="team-box team-box--right">
          ${flag(b)}
          <strong>${b.nome}</strong>
          <small>${b.codigo}</small>
        </div>
      </div>

      <div class="game-date">⏱ ${formatDate(game.data_hora)}</div>

      ${mode === "predict" ? `
        <div class="prediction-strip ${scoreView.acertou === true ? "hit" : ""}">${result}</div>
        <div class="predict-form">
          ${renderScoreInput(game, a.codigo, "a", prediction?.gols_a_palpite, locked)}
          <span class="versus">x</span>
          ${renderScoreInput(game, b.codigo, "b", prediction?.gols_b_palpite, locked)}
          <button class="btn btn-primary" data-save-prediction="${game.id}" ${locked ? "disabled" : ""}>Salvar</button>
        </div>
        ${locked ? `<div class="mini-alert">Palpite encerrado — partida iniciada.</div>` : ""}
      ` : ""}
    </article>
  `;
}

function select(key, label, values) {
  return `
    <label class="select-filter">
      <span>${label}</span>
      <select data-filter="${key}">
        ${values.map((value) => `<option value="${value}" ${String(state.filters[key]) === String(value) ? "selected" : ""}>${value}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderFilters() {
  const groups = [...new Set(state.games.map((game) => game.grupo).filter(Boolean))].sort();
  const rounds = [...new Set(state.games.map((game) => game.rodada).filter(Boolean))].sort((a, b) => a - b);
  const phases = [...new Set(state.games.map((game) => game.fase).filter(Boolean))];
  return `
    <div class="filters">
      ${select("grupo", "Grupo", ["todos", ...groups])}
      ${select("rodada", "Rodada", ["todos", ...rounds])}
      ${select("fase", "Fase", ["todos", ...phases])}
      ${select("status", "Status", ["todos", "aberto", "fechado", "encerrado", "apurado"])}
      <button class="btn btn-light" data-clear-filters>Limpar</button>
    </div>
  `;
}

function renderProfilePanel() {
  return `
    <aside class="profile-panel">
      <div class="panel-title"><span>🏆</span><div><h3>Palpiteiro</h3><p>Consulta individual protegida.</p></div></div>
      <div class="logged-card">
        <strong>${state.profile?.apelido || state.profile?.nome}</strong>
        <span>${isAdmin() ? "Administrador" : "Participante"}</span>
      </div>
      <div class="rule-card">
        <strong>Regra simples</strong>
        <span>Placar exato vale 1 ponto. O palpite trava no início da partida.</span>
      </div>
      <button class="btn btn-light wide" data-logout>Sair</button>
    </aside>
  `;
}

function renderPredictions() {
  return `
    <section class="layout-predict">
      <div class="main-panel">
        <div class="section-head">
          <div class="badge-icon">⚽</div>
          <div>
            <h2>Qual o placar?</h2>
            <p>Escolha o jogo, informe os gols e salve antes da bola rolar.</p>
          </div>
        </div>
        ${renderFilters()}
        <div class="games-list">${filteredGames().map((game) => renderGameCard(game)).join("") || `<div class="empty">Nenhum jogo encontrado.</div>`}</div>
      </div>
      ${renderProfilePanel()}
    </section>
  `;
}

function renderGames() {
  return `
    <section class="main-panel single">
      <div class="section-head"><div class="badge-icon">📅</div><div><h2>Jogos e placares</h2><p>Consulta geral por grupo, rodada e fase.</p></div></div>
      ${renderFilters()}
      <div class="games-list list-mode">${filteredGames().map((game) => renderGameCard(game, "list")).join("")}</div>
    </section>
  `;
}

function playedGroupGames() {
  return state.games.filter((game) => game.fase === "GRUPOS" && game.gols_a !== null && game.gols_b !== null);
}

function groupTeams() {
  const groups = {};
  state.games.filter((game) => game.fase === "GRUPOS").forEach((game) => {
    const group = game.grupo || "-";
    groups[group] ||= {};
    [team(game.time_a_id), team(game.time_b_id)].forEach((item) => {
      if (!item?.id) return;
      groups[group][item.id] ||= { team: item, jogos: 0, vitorias: 0, empates: 0, derrotas: 0, pontos: 0 };
    });
  });
  return groups;
}

function computeStandings() {
  const groups = groupTeams();
  playedGroupGames().forEach((game) => {
    const group = game.grupo || "-";
    groups[group] ||= {};
    [team(game.time_a_id), team(game.time_b_id)].forEach((item) => {
      groups[group][item.id] ||= { team: item, jogos: 0, vitorias: 0, empates: 0, derrotas: 0, pontos: 0 };
    });
    const home = groups[group][game.time_a_id];
    const away = groups[group][game.time_b_id];
    home.jogos += 1;
    away.jogos += 1;
    if (Number(game.gols_a) > Number(game.gols_b)) {
      home.vitorias += 1;
      home.pontos += 3;
      away.derrotas += 1;
    } else if (Number(game.gols_a) < Number(game.gols_b)) {
      away.vitorias += 1;
      away.pontos += 3;
      home.derrotas += 1;
    } else {
      home.empates += 1;
      away.empates += 1;
      home.pontos += 1;
      away.pontos += 1;
    }
  });
  return groups;
}

function groupGamesByGroup() {
  const groups = {};
  state.games.filter((game) => game.fase === "GRUPOS").forEach((game) => {
    const group = game.grupo || "-";
    groups[group] ||= [];
    groups[group].push(game);
  });
  Object.values(groups).forEach((games) => games.sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora)));
  return groups;
}

function renderMiniGame(game) {
  const a = team(game.time_a_id);
  const b = team(game.time_b_id);
  const score = game.gols_a === null || game.gols_b === null ? "x" : `${game.gols_a} x ${game.gols_b}`;
  return `
    <div class="mini-game">
      <div class="mini-date">${formatDate(game.data_hora)}</div>
      <div class="mini-match">
        <span class="mini-team mini-team-a"><span class="mini-team-name">${a.nome}</span>${flag(a)}</span>
        <strong class="mini-score">${score}</strong>
        <span class="mini-team mini-team-b">${flag(b)}<span class="mini-team-name">${b.nome}</span></span>
      </div>
    </div>
  `;
}

function renderGroupTable(group, rows) {
  const order = Object.fromEntries((seed.teams || []).filter((item) => item.grupo_atual === group).map((item, index) => [item.id, index]));
  const sorted = Object.values(rows).sort((a, b) => b.pontos - a.pontos || b.vitorias - a.vitorias || a.empates - b.empates || (order[a.team.id] ?? 99) - (order[b.team.id] ?? 99) || a.team.nome.localeCompare(b.team.nome));
  return `
    <article class="group-classic-card">
      <div class="classic-title">Grupo ${group}</div>
      <div class="classic-table">
        <div class="classic-head">
          <span>Classificação</span><b>P</b><b>J</b><b>V</b><b>E</b><b>D</b>
        </div>
        ${sorted.map((row, index) => `
          <div class="classic-row ${index < 2 ? "direct" : index === 2 ? "third" : ""}">
            <span class="classic-team"><em>${index + 1}</em>${flag(row.team)}<strong>${row.team.nome}</strong></span>
            <b class="pts">${row.pontos}</b>
            <span>${row.jogos}</span>
            <span>${row.vitorias}</span>
            <span>${row.empates}</span>
            <span>${row.derrotas}</span>
          </div>
        `).join("")}
      </div>
    </article>
  `;
}

function renderRoundBlock(round, games) {
  return `
    <div class="classic-round">
      <div class="classic-round__head">${round}ª rodada</div>
      <div class="classic-round__games">
        ${games.map(renderMiniGame).join("")}
      </div>
    </div>
  `;
}

function renderGroupFixturePanel(group, games) {
  const byRound = {};
  games.forEach((game) => { byRound[game.rodada] ||= []; byRound[game.rodada].push(game); });
  return `
    <aside class="group-fixture-card">
      ${Object.entries(byRound).sort(([a], [b]) => Number(a) - Number(b)).map(([round, items]) => renderRoundBlock(round, items)).join("")}
    </aside>
  `;
}

function renderGroupsAndResults() {
  const standings = computeStandings();
  const gamesByGroup = groupGamesByGroup();
  const groupKeys = [...new Set([...Object.keys(standings), ...Object.keys(gamesByGroup)])]
    .sort((a, b) => groupOrder.indexOf(a) - groupOrder.indexOf(b));
  return `
    <section class="main-panel single tournament-section tables-like-ge">
      <div class="section-head"><div class="badge-icon">📊</div><div><h2>Fase de grupos</h2><p>Classificação e jogos por grupo. Vitória vale 3, empate 1 e derrota 0.</p></div></div>
      <div class="group-stage-list">
        ${groupKeys.map((group) => `
          <section class="group-stage-block" id="grupo-${group}">
            <div class="group-stage-title">Grupo ${group}</div>
            <div class="group-stage-grid">
              ${renderGroupTable(group, standings[group] || {})}
              ${renderGroupFixturePanel(group, gamesByGroup[group] || [])}
            </div>
          </section>
        `).join("") || `<div class="empty">Importe jogos da fase de grupos para montar as tabelas.</div>`}
      </div>
    </section>
  `;
}

function phaseOrder() {
  return ["16_AVOS", "OITAVAS", "QUARTAS", "SEMIFINAL", "TERCEIRO_LUGAR", "FINAL"];
}

function renderKnockoutCard(game) {
  const a = team(game.time_a_id);
  const b = team(game.time_b_id);
  const score = game.gols_a === null || game.gols_b === null ? "x" : `${game.gols_a} x ${game.gols_b}`;
  return `
    <div class="bracket-card">
      <small>${game.codigo_jogo || "Jogo"} • ${formatDate(game.data_hora)}</small>
      <div><span>${flag(a)} ${a.nome}</span><strong>${score}</strong></div>
      <div><span>${flag(b)} ${b.nome}</span><strong></strong></div>
    </div>
  `;
}

const knockoutTemplate = [
  {
    "phase": "16_AVOS",
    "code": "M73",
    "label": "2A x 2B"
  },
  {
    "phase": "16_AVOS",
    "code": "M74",
    "label": "1E x 3A/B/C/D/F"
  },
  {
    "phase": "16_AVOS",
    "code": "M75",
    "label": "1F x 2C"
  },
  {
    "phase": "16_AVOS",
    "code": "M76",
    "label": "1C x 2F"
  },
  {
    "phase": "16_AVOS",
    "code": "M77",
    "label": "1J x 3C/D/G/H"
  },
  {
    "phase": "16_AVOS",
    "code": "M78",
    "label": "2E x 2I"
  },
  {
    "phase": "16_AVOS",
    "code": "M79",
    "label": "1A x 3C/E/F/H"
  },
  {
    "phase": "16_AVOS",
    "code": "M80",
    "label": "1L x 3A/B/H/K"
  },
  {
    "phase": "16_AVOS",
    "code": "M81",
    "label": "1D x 3E/F/I/J"
  },
  {
    "phase": "16_AVOS",
    "code": "M82",
    "label": "1G x 3A/B/H/I/J"
  },
  {
    "phase": "16_AVOS",
    "code": "M83",
    "label": "2K x 2L"
  },
  {
    "phase": "16_AVOS",
    "code": "M84",
    "label": "1H x 2J"
  },
  {
    "phase": "16_AVOS",
    "code": "M85",
    "label": "1B x 3F/G/J"
  },
  {
    "phase": "16_AVOS",
    "code": "M86",
    "label": "1J x 2H"
  },
  {
    "phase": "16_AVOS",
    "code": "M87",
    "label": "1K x 3D/E/L"
  },
  {
    "phase": "16_AVOS",
    "code": "M88",
    "label": "2D x 2G"
  },
  {
    "phase": "OITAVAS",
    "code": "M89",
    "label": "Vencedor M74 x vencedor M77"
  },
  {
    "phase": "OITAVAS",
    "code": "M90",
    "label": "Vencedor M73 x vencedor M75"
  },
  {
    "phase": "OITAVAS",
    "code": "M91",
    "label": "Vencedor M76 x vencedor M78"
  },
  {
    "phase": "OITAVAS",
    "code": "M92",
    "label": "Vencedor M79 x vencedor M80"
  },
  {
    "phase": "OITAVAS",
    "code": "M93",
    "label": "Vencedor M83 x vencedor M84"
  },
  {
    "phase": "OITAVAS",
    "code": "M94",
    "label": "Vencedor M81 x vencedor M82"
  },
  {
    "phase": "OITAVAS",
    "code": "M95",
    "label": "Vencedor M86 x vencedor M88"
  },
  {
    "phase": "OITAVAS",
    "code": "M96",
    "label": "Vencedor M85 x vencedor M87"
  },
  {
    "phase": "QUARTAS",
    "code": "M97",
    "label": "Vencedor M89 x vencedor M90"
  },
  {
    "phase": "QUARTAS",
    "code": "M98",
    "label": "Vencedor M93 x vencedor M94"
  },
  {
    "phase": "QUARTAS",
    "code": "M99",
    "label": "Vencedor M91 x vencedor M92"
  },
  {
    "phase": "QUARTAS",
    "code": "M100",
    "label": "Vencedor M95 x vencedor M96"
  },
  {
    "phase": "SEMIFINAL",
    "code": "M101",
    "label": "Vencedor M97 x vencedor M98"
  },
  {
    "phase": "SEMIFINAL",
    "code": "M102",
    "label": "Vencedor M99 x vencedor M100"
  },
  {
    "phase": "TERCEIRO_LUGAR",
    "code": "M103",
    "label": "Disputa de 3º lugar"
  },
  {
    "phase": "FINAL",
    "code": "M104",
    "label": "Final"
  }
];

function renderBracket() {
  const realKnockout = state.games.filter((game) => game.fase !== "GRUPOS");
  return `
    <section class="main-panel single tournament-section bracket-section">
      <div class="section-head"><div class="badge-icon">🏟️</div><div><h2>Chaveamento</h2><p>Estrutura completa do mata-mata. As seleções serão preenchidas conforme avançarem.</p></div></div>
      <div class="bracket-scroll">
        <div class="bracket bracket-full">
          ${phaseOrder().map((phase) => {
            const templates = knockoutTemplate.filter((item) => item.phase === phase);
            const games = realKnockout.filter((game) => game.fase === phase).sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora));
            return `
              <div class="bracket-column phase-${phase}">
                <h3>${formatPhase(phase)}</h3>
                ${templates.map((item) => {
                  const game = games.find((g) => g.codigo_jogo === item.code);
                  return game ? renderKnockoutCard(game) : `<div class="bracket-slot"><strong>${item.code}</strong><span>${item.label}</span><em>A definir</em></div>`;
                }).join("")}
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderStandings() {
  return `
    <section class="stacked tournament-page">
      ${renderGroupsAndResults()}
      ${renderBracket()}
    </section>
  `;
}

function rankingRows() {
  return state.profiles.filter((profile) => profile.ativo).map((profile) => {
    const items = state.predictions.filter((prediction) => prediction.user_id === profile.id);
    const scores = items.map((prediction) => computedPredictionScore(prediction));
    const pontos = scores.reduce((total, score) => total + Number(score.pontos || 0), 0);
    const acertos = scores.filter((score) => score.acertou === true).length;
    const aproveitamento = items.length ? Math.round((acertos / items.length) * 100) : 0;
    return { profile, pontos, palpites: items.length, acertos, aproveitamento };
  }).sort((a, b) => b.pontos - a.pontos || b.acertos - a.acertos || b.palpites - a.palpites || b.aproveitamento - a.aproveitamento || a.profile.nome.localeCompare(b.profile.nome));
}

function roundWinnerRows() {
  const rounds = {};
  state.games.forEach((game) => {
    const key = `${formatPhase(game.fase)} • Rodada ${game.rodada || "-"}`;
    rounds[key] ||= { key, games: [], totals: {} };
    rounds[key].games.push(game);
  });

  Object.values(rounds).forEach((round) => {
    round.games.forEach((game) => {
      state.predictions.filter((prediction) => prediction.game_id === game.id).forEach((prediction) => {
        const score = computedPredictionScore(prediction, game);
        if (score.pontos <= 0) return;
        const profile = state.profiles.find((item) => item.id === prediction.user_id);
        if (!profile) return;
        round.totals[profile.id] ||= { profile, pontos: 0, acertos: 0 };
        round.totals[profile.id].pontos += score.pontos;
        round.totals[profile.id].acertos += 1;
      });
    });
  });

  return Object.values(rounds)
    .map((round) => {
      const rows = Object.values(round.totals).sort((a, b) => b.pontos - a.pontos || b.acertos - a.acertos || a.profile.nome.localeCompare(b.profile.nome));
      const max = rows[0]?.pontos || 0;
      return { ...round, winners: max > 0 ? rows.filter((row) => row.pontos === max) : [] };
    })
    .filter((round) => round.games.some((game) => game.gols_a !== null && game.gols_b !== null) || round.winners.length)
    .sort((a, b) => {
      const ag = a.games[0];
      const bg = b.games[0];
      return new Date(ag?.data_hora || 0) - new Date(bg?.data_hora || 0);
    });
}

function renderRoundWinners() {
  const rounds = roundWinnerRows();
  return `
    <div class="round-winners">
      <div class="section-head compact"><div class="badge-icon">🎯</div><div><h2>Vencedor da rodada</h2><p>Quem somou mais cravadas na rodada. Se empatar, aparecem todos.</p></div></div>
      ${rounds.length ? rounds.map((round) => `
        <div class="round-card">
          <div><strong>${round.key}</strong><span>${round.games.length} jogo(s)</span></div>
          <div class="round-names">
            ${round.winners.length ? round.winners.map((winner) => `<span>${winner.profile.apelido || winner.profile.nome} • ${winner.pontos} pt</span>`).join("") : `<span>Sem vencedor ainda</span>`}
          </div>
        </div>
      `).join("") : `<div class="empty compact-empty">Lance resultados oficiais para aparecerem os vencedores de rodada.</div>`}
    </div>
  `;
}


function formatRoundTitle(game) {
  if (!game) return "Rodada";
  if (game.fase === "GRUPOS") return `Fase de grupos • Rodada ${game.rodada || "-"}`;
  return `${formatPhase(game.fase)}${game.rodada ? ` • Rodada ${game.rodada}` : ""}`;
}

function groupedGamesByRound(games = state.games) {
  const map = {};
  games.forEach((game) => {
    const key = `${game.fase}|${game.rodada || 0}`;
    map[key] ||= { key, title: formatRoundTitle(game), games: [] };
    map[key].games.push(game);
  });
  return Object.values(map)
    .map((round) => ({ ...round, games: round.games.sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora)) }))
    .sort((a, b) => new Date(a.games[0]?.data_hora || 0) - new Date(b.games[0]?.data_hora || 0));
}

function renderPredictionRowsForGame(game) {
  const a = team(game.time_a_id);
  const b = team(game.time_b_id);
  const locked = isLocked(game);
  const rows = state.predictions
    .filter((prediction) => prediction.game_id === game.id)
    .map((prediction) => ({ prediction, profile: state.profiles.find((profile) => profile.id === prediction.user_id) }))
    .filter((row) => row.profile)
    .sort((x, y) => (x.profile.apelido || x.profile.nome).localeCompare(y.profile.apelido || y.profile.nome));

  if (!rows.length) {
    return `<div class="public-prediction empty-line">Nenhum palpite registrado ainda.</div>`;
  }

  return rows.map(({ prediction, profile }) => {
    const own = state.profile?.id === profile.id;
    const canShow = locked || own || game.gols_a !== null || game.gols_b !== null;
    const score = canShow ? `${prediction.gols_a_palpite} x ${prediction.gols_b_palpite}` : "oculto até o início";
    const scoreView = computedPredictionScore(prediction, game);
    const pointsLabel = scoreView.acertou === true ? "1 ponto" : scoreView.acertou === false ? "0 ponto" : "aguardando";
    return `
      <div class="public-prediction ${own ? "own" : ""}">
        <span class="public-name">${profile.apelido || profile.nome}</span>
        <strong>${score}</strong>
        <span class="public-points">${pointsLabel}</span>
      </div>
    `;
  }).join("");
}

function renderPredictionGameBlock(game) {
  const a = team(game.time_a_id);
  const b = team(game.time_b_id);
  const officialScore = game.gols_a === null || game.gols_b === null ? "x" : `${game.gols_a} x ${game.gols_b}`;
  return `
    <article class="public-game-card">
      <div class="public-game-head">
        <div class="public-match">
          <span>${flag(a)} ${a.nome}</span>
          <strong>${officialScore}</strong>
          <span>${flag(b)} ${b.nome}</span>
        </div>
        <small>${formatDate(game.data_hora)} • ${gameStatus(game)}</small>
      </div>
      <div class="public-predictions-list">
        ${renderPredictionRowsForGame(game)}
      </div>
    </article>
  `;
}

function renderAllPredictions() {
  const rounds = groupedGamesByRound(state.games);
  return `
    <section class="stacked public-page">
      <div class="main-panel single">
        <div class="section-head"><div class="badge-icon">👀</div><div><h2>Palpites por rodada</h2><p>Consulta dos palpites. Antes do início do jogo, cada um vê o próprio palpite; depois da trava, todos ficam visíveis.</p></div></div>
        <div class="rounds-stack">
          ${rounds.map((round) => `
            <section class="round-section">
              <div class="round-section-head"><h3>${round.title}</h3><span>${round.games.length} jogo(s)</span></div>
              <div class="public-games-grid">${round.games.map(renderPredictionGameBlock).join("")}</div>
            </section>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function activeProfiles() {
  return state.profiles
    .filter((profile) => profile.ativo)
    .sort((a, b) => (a.apelido || a.nome).localeCompare(b.apelido || b.nome));
}

function profileDisplayName(profile) {
  return profile?.apelido || profile?.nome || "Palpiteiro";
}

function predictionTimestamp(prediction) {
  const value = prediction?.updated_at || prediction?.created_at;
  return value ? new Date(value).getTime() : 0;
}

function partnerStats(profile) {
  const items = state.predictions.filter((prediction) => prediction.user_id === profile.id);
  const scores = items.map((prediction) => computedPredictionScore(prediction));
  const acertos = scores.filter((score) => score.acertou === true).length;
  const pontos = scores.reduce((total, score) => total + Number(score.pontos || 0), 0);
  const aproveitamento = items.length ? Math.round((acertos / items.length) * 100) : 0;
  const last = items.reduce((latest, prediction) => Math.max(latest, predictionTimestamp(prediction)), 0);
  return { palpites: items.length, acertos, pontos, aproveitamento, last };
}

function formatShortDateTime(timestamp) {
  if (!timestamp) return "sem palpite ainda";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(timestamp));
}

function canShowPredictionForProfile(game, profile) {
  return state.profile?.id === profile?.id || isLocked(game) || game.gols_a !== null || game.gols_b !== null;
}

function renderPartnerCard(profile) {
  const stats = partnerStats(profile);
  const selected = selectedPartner()?.id === profile.id;
  return `
    <button class="partner-card ${selected ? "active" : ""}" data-partner-id="${profile.id}">
      <div class="partner-avatar">${profileDisplayName(profile).slice(0, 1).toUpperCase()}</div>
      <div class="partner-info">
        <strong>${profileDisplayName(profile)}</strong>
        <span>${stats.palpites} palpites • ${stats.acertos} acertos • ${stats.pontos} pts</span>
        <small>Último: ${formatShortDateTime(stats.last)}</small>
      </div>
      <div class="partner-percent">${stats.aproveitamento}%</div>
    </button>
  `;
}

function selectedPartner() {
  const profiles = activeProfiles();
  const selected = profiles.find((profile) => profile.id === state.selectedPartnerId);
  return selected || profiles[0] || null;
}

function renderPartnerPredictionLine(game, profile) {
  const a = team(game.time_a_id);
  const b = team(game.time_b_id);
  const prediction = predictionFor(game.id, profile.id);
  const officialScore = game.gols_a === null || game.gols_b === null ? "-" : `${game.gols_a} x ${game.gols_b}`;
  let score = "sem palpite";
  let rowClass = "missing";
  let points = "-";

  if (prediction) {
    const visible = canShowPredictionForProfile(game, profile);
    score = visible ? `${prediction.gols_a_palpite} x ${prediction.gols_b_palpite}` : "oculto até o início";
    rowClass = visible ? "visible" : "hidden";
    const scoreView = computedPredictionScore(prediction, game);
    points = scoreView.acertou === true ? "1" : scoreView.acertou === false ? "0" : "aguardando";
  }

  return `
    <tr class="partner-prediction-row ${rowClass}">
      <td><span class="partner-round">R${game.rodada || "-"}</span></td>
      <td><div class="partner-match">${flag(a)} <strong>${a.nome}</strong><span>x</span><strong>${b.nome}</strong> ${flag(b)}</div><small>${formatDate(game.data_hora)}</small></td>
      <td><strong>${score}</strong></td>
      <td>${officialScore}</td>
      <td>${points}</td>
    </tr>
  `;
}

function renderPartnerDetail(profile) {
  if (!profile) {
    return `<div class="main-panel partner-detail"><div class="empty">Nenhum palpiteiro cadastrado.</div></div>`;
  }
  const stats = partnerStats(profile);
  const rounds = groupedGamesByRound(state.games);
  return `
    <div class="main-panel partner-detail">
      <div class="partner-detail-head">
        <div>
          <span class="eyebrow">Ficha do palpiteiro</span>
          <h2>${profileDisplayName(profile)}</h2>
          <p>Antes da partida começar, o placar dos outros fica protegido. Depois da trava, todos visualizam.</p>
        </div>
        <div class="partner-score-box">
          <strong>${stats.pontos}</strong>
          <span>ponto(s)</span>
        </div>
      </div>
      <div class="partner-kpis">
        <div><strong>${stats.palpites}</strong><span>palpites</span></div>
        <div><strong>${stats.acertos}</strong><span>acertos</span></div>
        <div><strong>${stats.aproveitamento}%</strong><span>aproveitamento</span></div>
        <div><strong>${formatShortDateTime(stats.last)}</strong><span>último palpite</span></div>
      </div>
      <div class="partner-rounds">
        ${rounds.map((round) => `
          <section class="partner-round-card">
            <div class="round-section-head compact"><h3>${round.title}</h3><span>${round.games.length} jogo(s)</span></div>
            <div class="partner-table-wrap">
              <table class="partner-table">
                <thead><tr><th>Rod.</th><th>Jogo</th><th>Palpite</th><th>Resultado</th><th>Pts</th></tr></thead>
                <tbody>${round.games.map((game) => renderPartnerPredictionLine(game, profile)).join("")}</tbody>
              </table>
            </div>
          </section>
        `).join("")}
      </div>
    </div>
  `;
}

function renderPartners() {
  const profiles = activeProfiles();
  const current = selectedPartner();
  return `
    <section class="partners-page">
      <aside class="main-panel partners-list-panel">
        <div class="section-head compact"><div class="badge-icon">🤝</div><div><h2>Parceiros</h2><p>Clique no nome para acompanhar os palpites.</p></div></div>
        <div class="partners-list">
          ${profiles.map(renderPartnerCard).join("") || `<div class="empty">Nenhum parceiro cadastrado.</div>`}
        </div>
      </aside>
      ${renderPartnerDetail(current)}
    </section>
  `;
}

function renderBrazilGames() {
  const brasil = state.teams.find((item) => normalizeText(item.nome) === "brasil" || item.codigo === "BRA");
  const games = state.games
    .filter((game) => brasil && (game.time_a_id === brasil.id || game.time_b_id === brasil.id))
    .sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora));
  return `
    <section class="stacked public-page">
      <div class="main-panel single brazil-panel">
        <div class="section-head"><div class="badge-icon">🇧🇷</div><div><h2>Jogos do Brasil</h2><p>Atalho para a gurizada palpitar e acompanhar somente os jogos da Seleção.</p></div></div>
        <div class="games-list list-mode">
          ${games.map((game) => renderGameCard(game, "predict")).join("") || `<div class="empty">Jogos do Brasil ainda não cadastrados.</div>`}
        </div>
      </div>
    </section>
  `;
}

function renderRanking() {
  const rows = rankingRows();
  return `
    <section class="ranking-page">
      <div class="main-panel ranking-main">
        <div class="section-head"><div class="badge-icon">🏆</div><div><h2>Ranking geral</h2><p>1 ponto para cada placar exato.</p></div></div>
        <div class="ranking-list">
          ${rows.map((row, index) => `
            <div class="ranking-card ${index < 3 ? "podium" : ""}">
              <div class="rank-pos">${index + 1}</div>
              <div class="rank-player"><strong>${row.profile.apelido || row.profile.nome}</strong><span>${row.palpites} palpites • ${row.acertos} acertos • ${row.aproveitamento}%</span></div>
              <div class="rank-points"><strong>${row.pontos}</strong><span>pts</span></div>
            </div>
          `).join("")}
        </div>
      </div>
      <aside class="main-panel ranking-side">
        ${renderRoundWinners()}
      </aside>
    </section>
  `;
}

async function saveGameResult() {
  const id = document.querySelector("[data-admin-game]").value;
  const game = state.games.find((item) => item.id === id);
  if (!game) return;
  game.gols_a = Number(document.querySelector("[data-admin-gols-a]").value);
  game.gols_b = Number(document.querySelector("[data-admin-gols-b]").value);
  game.status = document.querySelector("[data-admin-status]").value;
  state.predictions = state.predictions.map((prediction) => prediction.game_id === game.id ? scorePrediction(prediction, game) : prediction);

  if (supabase) {
    await supabase.from("games").update({ gols_a: game.gols_a, gols_b: game.gols_b, status: game.status }).eq("id", game.id);
    for (const prediction of state.predictions.filter((item) => item.game_id === game.id)) {
      const score = computedPredictionScore(prediction, game);
      await supabase.from("predictions").update({ acertou: score.acertou, pontos: score.pontos }).eq("id", prediction.id);
    }
  }
  state.message = "Resultado salvo e ranking recalculado.";
  saveLocal();
  render();
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(",").map((item) => item.trim());
  const expected = ["codigo_jogo", "fase", "grupo", "rodada", "data_hora", "time_a", "codigo_time_a", "time_b", "codigo_time_b", "gols_a", "gols_b", "status"];
  const missing = expected.filter((item) => !headers.includes(item));
  const rows = lines.map((line, index) => {
    const values = line.split(",");
    return headers.reduce((row, header, i) => ({ ...row, [header]: values[i]?.trim() || "" }), { linha: index + 2 });
  });
  return { missing, rows };
}

function ensureTeam(name, code) {
  const normalized = String(code || "").toUpperCase();
  let existing = state.teams.find((item) => item.codigo === normalized);
  if (!existing) {
    const flagCode = flagCdn[normalized];
    existing = { id: crypto.randomUUID(), nome: name, codigo: normalized, flag_url: flagCode ? `https://flagcdn.com/w80/${flagCode}.png` : "", continente: "", ativo: true };
    state.teams.push(existing);
  }
  return existing;
}

async function importCsv() {
  if (!state.csv || state.csv.missing.length) return;
  let inserted = 0;
  let updated = 0;
  const rejected = [];
  for (const row of state.csv.rows) {
    if (!row.codigo_jogo || !row.fase || !row.data_hora || !row.codigo_time_a || !row.codigo_time_b) {
      rejected.push(row);
      continue;
    }
    const teamA = ensureTeam(row.time_a, row.codigo_time_a);
    const teamB = ensureTeam(row.time_b, row.codigo_time_b);
    const payload = {
      id: state.games.find((game) => game.codigo_jogo === row.codigo_jogo)?.id || crypto.randomUUID(),
      codigo_jogo: row.codigo_jogo,
      fase: row.fase,
      grupo: row.grupo || null,
      rodada: Number(row.rodada || 0),
      data_hora: row.data_hora.includes("T") ? row.data_hora : row.data_hora.replace(" ", "T") + ":00-03:00",
      time_a_id: teamA.id,
      time_b_id: teamB.id,
      gols_a: row.gols_a === "" ? null : Number(row.gols_a),
      gols_b: row.gols_b === "" ? null : Number(row.gols_b),
      status: row.status || "aberto"
    };
    const currentIndex = state.games.findIndex((game) => game.codigo_jogo === row.codigo_jogo);
    if (currentIndex >= 0) { state.games[currentIndex] = payload; updated += 1; }
    else { state.games.push(payload); inserted += 1; }
    if (supabase) await supabase.from("games").upsert(payload, { onConflict: "codigo_jogo" });
  }
  state.message = `Importação concluída: ${inserted} inseridos, ${updated} atualizados, ${rejected.length} rejeitados.`;
  state.csv = null;
  saveLocal();
  render();
}


async function createProfile() {
  const nome = document.querySelector("[data-new-profile-name]")?.value.trim();
  const apelido = document.querySelector("[data-new-profile-nick]")?.value.trim();
  const email = document.querySelector("[data-new-profile-email]")?.value.trim();
  const senha = document.querySelector("[data-new-profile-password]")?.value.trim();
  const role = document.querySelector("[data-new-profile-role]")?.value || "participante";

  if (!nome || !apelido || !senha) {
    state.message = "Informe nome, apelido/usuário e senha do palpiteiro.";
    render();
    return;
  }

  const exists = state.profiles.some((profile) => normalizeText(profile.apelido) === normalizeText(apelido) || normalizeText(profile.nome) === normalizeText(nome) || (email && normalizeText(profile.email) === normalizeText(email)));
  if (exists) {
    state.message = "Já existe palpiteiro com esse nome, apelido/usuário ou e-mail.";
    render();
    return;
  }

  const payload = {
    id: crypto.randomUUID(),
    nome,
    apelido,
    email: email || `${normalizeText(apelido).replace(/\s+/g, ".")}@palpitao.local`,
    role,
    senha,
    ativo: true
  };

  if (supabase) {
    const { error } = await supabase.from("profiles").insert(payload);
    if (error) {
      state.message = `Erro ao cadastrar no Supabase: ${error.message}`;
      render();
      return;
    }
  }

  state.profiles.push(payload);
  state.message = `Palpiteiro ${apelido} cadastrado como ${role}.`;
  saveLocal();
  render();
}

async function updateProfileField(profileId, patch, successMessage) {
  const profile = state.profiles.find((item) => item.id === profileId);
  if (!profile) {
    state.message = "Palpiteiro não encontrado.";
    render();
    return;
  }

  if (supabase) {
    const { error } = await supabase.from("profiles").update(patch).eq("id", profileId);
    if (error) {
      state.message = `Erro ao atualizar no Supabase: ${error.message}`;
      render();
      return;
    }
  }

  Object.assign(profile, patch);
  if (state.profile?.id === profileId) {
    Object.assign(state.profile, patch);
    localStorage.setItem("palpitao_profile", JSON.stringify(state.profile));
  }
  state.message = successMessage;
  saveLocal();
  render();
}

function activeAdminCount() {
  return state.profiles.filter((profile) => profile.ativo !== false && normalizeRole(profile.role) === "admin").length;
}

async function setProfileRole(profileId, role) {
  const profile = state.profiles.find((item) => item.id === profileId);
  if (!profile) return;
  if (normalizeRole(profile.role) === "admin" && role !== "admin" && activeAdminCount() <= 1) {
    state.message = "Não é permitido remover o último administrador ativo.";
    render();
    return;
  }
  await updateProfileField(profileId, { role }, `${profile.apelido || profile.nome} agora está como ${role}.`);
}

async function toggleProfileActive(profileId) {
  const profile = state.profiles.find((item) => item.id === profileId);
  if (!profile) return;
  if (profile.ativo !== false && normalizeRole(profile.role) === "admin" && activeAdminCount() <= 1) {
    state.message = "Não é permitido desativar o último administrador ativo.";
    render();
    return;
  }
  await updateProfileField(profileId, { ativo: !(profile.ativo !== false) }, `${profile.apelido || profile.nome} ${profile.ativo === false ? "ativado" : "desativado"}.`);
}

async function resetProfilePassword(profileId) {
  const input = document.querySelector(`[data-profile-password="${profileId}"]`);
  const senha = input?.value.trim();
  const profile = state.profiles.find((item) => item.id === profileId);
  if (!profile) return;
  if (!senha) {
    state.message = "Digite a nova senha antes de salvar.";
    render();
    return;
  }
  await updateProfileField(profileId, { senha }, `Senha de ${profile.apelido || profile.nome} atualizada.`);
}

function renderProfileAdminRow(profile) {
  const isCurrent = state.profile?.id === profile.id;
  const isAdminProfile = normalizeRole(profile.role) === "admin";
  const status = profile.ativo === false ? "inativo" : "ativo";
  return `
    <div class="user-admin-card ${isCurrent ? "current" : ""} ${profile.ativo === false ? "inactive" : ""}">
      <div class="user-admin-main">
        <div class="avatar small">${initials(profile.nome || profile.apelido)}</div>
        <div>
          <strong>${profile.apelido || profile.nome}</strong>
          <span>${profile.nome} • ${profile.email || "sem e-mail"}</span>
          <em>Login: ${profile.apelido || profile.nome} ${profile.email ? `ou ${profile.email}` : ""} • Perfil: ${profile.role} • ${status}</em>
        </div>
      </div>
      <div class="user-admin-actions">
        <button class="btn btn-soft" data-set-profile-role="${profile.id}" data-role-target="${isAdminProfile ? "participante" : "admin"}">${isAdminProfile ? "Tornar participante" : "Tornar admin"}</button>
        <button class="btn btn-soft" data-toggle-profile-active="${profile.id}">${profile.ativo === false ? "Ativar" : "Desativar"}</button>
      </div>
      <div class="password-reset-row">
        <input data-profile-password="${profile.id}" type="password" placeholder="Nova senha">
        <button class="btn btn-primary" data-reset-profile-password="${profile.id}">Salvar senha</button>
      </div>
    </div>
  `;
}


function renderAdmin() {
  const gameOptions = state.games.map((game) => `<option value="${game.id}">${game.codigo_jogo} - ${team(game.time_a_id).nome} x ${team(game.time_b_id).nome}</option>`).join("");
  const admins = state.profiles.filter((profile) => normalizeRole(profile.role) === "admin" && profile.ativo !== false);
  return `
    <section class="admin-layout">
      <div class="main-panel">
        <div class="section-head"><div class="badge-icon">✍️</div><div><h2>Lançar resultado</h2><p>Salva o placar oficial e recalcula os palpites.</p></div></div>
        <label class="field"><span>Jogo</span><select data-admin-game>${gameOptions}</select></label>
        <div class="form-row">
          <label class="field"><span>Gols A</span><input data-admin-gols-a type="number" min="0" value="0"></label>
          <label class="field"><span>Gols B</span><input data-admin-gols-b type="number" min="0" value="0"></label>
        </div>
        <label class="field"><span>Status</span><select data-admin-status><option>encerrado</option><option>apurado</option><option>aberto</option><option>fechado</option></select></label>
        <button class="btn btn-primary wide" data-save-result>Salvar resultado</button>
      </div>
      <div class="main-panel">
        <div class="section-head"><div class="badge-icon">CSV</div><div><h2>Importar CSV</h2><p>Suba jogos e resultados em lote.</p></div></div>
        <input class="file-input" type="file" accept=".csv,text/csv" data-csv-file>
        ${state.csv ? `
          <div class="notice ${state.csv.missing.length ? "error" : ""}">${state.csv.missing.length ? `Cabeçalhos ausentes: ${state.csv.missing.join(", ")}` : `${state.csv.rows.length} linhas prontas para importar.`}</div>
          <div class="csv-preview"><table><tbody>${state.csv.rows.slice(0, 5).map((row) => `<tr><td>${row.codigo_jogo}</td><td>${row.fase}</td><td>${row.time_a} x ${row.time_b}</td><td>${row.data_hora}</td></tr>`).join("")}</tbody></table></div>
          <button class="btn btn-primary wide" data-import-csv ${state.csv.missing.length ? "disabled" : ""}>Importar CSV</button>
        ` : `<div class="rule-card"><strong>Modelo</strong><span>Use o arquivo docs/modelo_importacao_jogos.csv.</span></div>`}
      </div>
      <div class="main-panel single-span">
        <div class="section-head"><div class="badge-icon">👥</div><div><h2>Usuários e administradores</h2><p>Cadastre palpiteiros a qualquer momento, defina senha e promova mais de um admin.</p></div></div>
        <div class="admin-summary">
          <span><strong>${state.profiles.length}</strong> usuário(s)</span>
          <span><strong>${admins.length}</strong> admin(s) ativo(s)</span>
          <span>Login aceita apelido, nome ou e-mail.</span>
        </div>
        <div class="profile-admin-grid">
          <div class="profile-form">
            <h3>Novo usuário</h3>
            <label class="field"><span>Nome</span><input data-new-profile-name placeholder="Nome completo"></label>
            <label class="field"><span>Apelido / usuário</span><input data-new-profile-nick placeholder="Ex.: Dudu"></label>
            <label class="field"><span>E-mail opcional</span><input data-new-profile-email placeholder="email@exemplo.com"></label>
            <label class="field"><span>Senha inicial</span><input data-new-profile-password type="password" placeholder="Ex.: 1234"></label>
            <label class="field"><span>Perfil</span><select data-new-profile-role><option value="participante">participante</option><option value="admin">admin</option></select></label>
            <button class="btn btn-primary wide" data-create-profile>Cadastrar usuário</button>
            <div class="rule-card"><strong>Regra de segurança</strong><span>O sistema não deixa remover ou desativar o último administrador ativo.</span></div>
          </div>
          <div class="people-list admin-users-list">
            ${state.profiles.map(renderProfileAdminRow).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function loginProfile() {
  const userInput = document.querySelector("[data-login-user]")?.value?.trim() || "";
  const password = document.querySelector("[data-login-password]")?.value || "";

  if (!userInput || !password) {
    state.message = "Informe usuário e senha para entrar.";
    renderLogin();
    return;
  }

  const userKey = normalizeText(userInput);
  const profile = state.profiles.find((item) => {
    const possibleUsers = [item.apelido, item.nome, item.email].map(normalizeText);
    return item.ativo !== false && possibleUsers.includes(userKey);
  });

  if (!profile || String(profile.senha || "") !== String(password)) {
    state.message = "Usuário ou senha inválidos.";
    renderLogin();
    return;
  }

  state.profile = profile;
  state.message = "";
  localStorage.setItem("palpitao_profile", JSON.stringify(state.profile));
  render();
}

function logoutProfile() {
  state.profile = null;
  state.view = "palpitar";
  state.message = "";
  localStorage.removeItem("palpitao_profile");
  renderLogin();
}

function isAdmin() {
  return normalizeRole(state.profile?.role) === "admin";
}

function renderLogin() {
  app.innerHTML = `
    <div class="login-screen">
      <div class="login-card">
        <div class="login-brand">
          <div class="logo-ball">P</div>
          <div><strong>PALPITÃO</strong><span>Qual o placar?</span></div>
        </div>
        <h1>Entrar no bolão</h1>
        <p>Cada palpiteiro entra com seu usuário e senha. Assim ninguém palpita no nome de outro.</p>
        ${state.message ? `<div class="notice global ${state.message.includes("inválidos") ? "error" : ""}">${state.message}</div>` : ""}
        <label class="field"><span>Usuário, apelido ou e-mail</span><input data-login-user autocomplete="username" placeholder="Ex.: César"></label>
        <label class="field"><span>Senha</span><input data-login-password type="password" autocomplete="current-password" placeholder="Digite sua senha"></label>
        <button class="btn btn-primary wide" data-login>Entrar</button>
        <div class="login-help">
          <strong>Acesso inicial de teste</strong>
          <span>Admin: César ou cesar@example.com / admin123</span>
          <span>Participantes exemplo: Ana ou João / 1234</span>
        </div>
      </div>
    </div>
  `;
  bindLoginEvents();
}

function bindLoginEvents() {
  document.querySelector("[data-login]")?.addEventListener("click", loginProfile);
  document.querySelector("[data-login-password]")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") loginProfile();
  });
  document.querySelector("[data-login-user]")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") document.querySelector("[data-login-password]")?.focus();
  });
}

function renderHeader() {
  const selected = state.profile ? (state.profile.apelido || state.profile.nome) : "Escolha o palpiteiro";
  return `
    <header class="app-header">
      <div class="brand-row">
        <div class="logo-ball">P</div>
        <div class="brand-text"><strong>PALPITÃO</strong><span>Qual o placar?</span></div>
      </div>
      <div class="header-flags"><span>🇧🇷 Brasil</span><span>🇨🇦 Canadá</span><span>🇺🇸 EUA</span><span>🇲🇽 México</span></div>
      <div class="hero-card">
        <div class="hero-copy">
          <span class="kicker">Copa 2026 • bolão entre amigos</span>
          <h1>Palpite simples. Ranking na hora.</h1>
          <p>Crava o placar antes do início da partida. Acertou exato, soma 1 ponto.</p>
          <div class="hero-stats"><span>1 ponto por cravada</span><span>Trava no horário do jogo</span><span>${selected}</span></div>
        </div>
        <a
          class="hero-worldcup"
          href="https://media.licdn.com/dms/image/v2/D4E1AAQE73S2n5CDnaA/storylineheaderimage-shrink_400_400/storylineheaderimage-shrink_400_400/0/1684502982782?e=2147483647&v=beta&t=hXy5uj7OCRckHP9XYDyOfNlQAlOSV5NauMFqqnWx6Ec"
          target="_blank"
          rel="noreferrer"
          aria-label="Imagem decorativa da Copa 2026"
        >
          <img
            src="https://media.licdn.com/dms/image/v2/D4E1AAQE73S2n5CDnaA/storylineheaderimage-shrink_400_400/storylineheaderimage-shrink_400_400/0/1684502982782?e=2147483647&v=beta&t=hXy5uj7OCRckHP9XYDyOfNlQAlOSV5NauMFqqnWx6Ec"
            alt="Copa 2026"
            loading="lazy"
            onerror="this.closest('.hero-worldcup').classList.add('image-off')"
          />
          <span class="hero-worldcup-fallback">🏆 Copa 2026</span>
        </a>
      </div>
    </header>
  `;
}

function render() {
  if (!state.profile) {
    renderLogin();
    return;
  }

  if (state.view === "admin" && !isAdmin()) state.view = "palpitar";

  const views = { palpitar: renderPredictions, palpites: renderAllPredictions, parceiros: renderPartners, brasil: renderBrazilGames, jogos: renderGames, tabelas: renderStandings, ranking: renderRanking, ...(isAdmin() ? { admin: renderAdmin } : {}) };
  const labels = { palpitar: "Palpitar", palpites: "Palpites", parceiros: "Parceiros", brasil: "Brasil", jogos: "Jogos", tabelas: "Tabelas", ranking: "Ranking", admin: "Admin" };
  if (!views[state.view]) state.view = "palpitar";

  app.innerHTML = `
    <div class="app-shell">
      ${renderHeader()}
      <main class="content">
        <nav class="tabs" aria-label="Navegação principal">
          ${Object.keys(views).map((view) => `<button class="tab ${state.view === view ? "active" : ""}" data-view="${view}">${labels[view]}</button>`).join("")}
        </nav>
        ${state.message ? `<div class="notice global">${state.message}</div>` : ""}
        ${safeRenderView(views[state.view])}
      </main>
    </div>
  `;
  bindEvents();
}

function safeRenderView(viewRenderer) {
  try {
    return viewRenderer();
  } catch (error) {
    console.error(error);
    return `<div class="main-panel single"><div class="section-head"><div class="badge-icon">⚠️</div><div><h2>Erro ao abrir a tela</h2><p>${escapeHtml(error.message || String(error))}</p></div></div></div>`;
  }
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => {
    state.view = button.dataset.view;
    state.message = "";
    render();
  }));
  document.querySelectorAll("[data-filter]").forEach((input) => input.addEventListener("change", () => {
    state.filters[input.dataset.filter] = input.value;
    render();
  }));
  document.querySelector("[data-clear-filters]")?.addEventListener("click", () => {
    state.filters = { grupo: "todos", rodada: "todos", fase: "todos", status: "todos" };
    render();
  });
  document.querySelector("[data-logout]")?.addEventListener("click", logoutProfile);
  document.querySelectorAll("[data-partner-id]").forEach((button) => button.addEventListener("click", () => {
    state.selectedPartnerId = button.dataset.partnerId;
    localStorage.setItem("palpitao_selected_partner", state.selectedPartnerId);
    render();
  }));
  document.querySelectorAll("[data-save-prediction]").forEach((button) => button.addEventListener("click", () => upsertPrediction(button.dataset.savePrediction)));
  document.querySelector("[data-save-result]")?.addEventListener("click", saveGameResult);
  document.querySelector("[data-create-profile]")?.addEventListener("click", createProfile);
  document.querySelectorAll("[data-set-profile-role]").forEach((button) => button.addEventListener("click", () => setProfileRole(button.dataset.setProfileRole, button.dataset.roleTarget)));
  document.querySelectorAll("[data-toggle-profile-active]").forEach((button) => button.addEventListener("click", () => toggleProfileActive(button.dataset.toggleProfileActive)));
  document.querySelectorAll("[data-reset-profile-password]").forEach((button) => button.addEventListener("click", () => resetProfilePassword(button.dataset.resetProfilePassword)));
  document.querySelector("[data-import-csv]")?.addEventListener("click", importCsv);
  document.querySelector("[data-csv-file]")?.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    state.csv = parseCsv(await file.text());
    render();
  });
}

async function initSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) return;
  const { createClient } = await import(/* @vite-ignore */ "https://esm.sh/@supabase/supabase-js@2");
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

initSupabase().then(loadData).catch((error) => {
  state.message = `Não foi possível iniciar o Supabase: ${error.message}`;
  loadData();
});
