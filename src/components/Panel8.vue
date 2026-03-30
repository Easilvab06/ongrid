<template>
  <div class="panel8">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>

    <div class="inner">
      <div class="header">
        <div class="header-badge">Análisis Financiero</div>
        <h3 class="panel-title">Proyección Flujo de Caja</h3>
        <p class="panel-subtitle">Evolución del retorno sobre la inversión solar a 10 años</p>
      </div>

      <div class="no-data" v-if="!hayDatos">
        <div class="no-data-icon">📊</div>
        <p class="no-data-text">Ingrese consumo y tarifa en el panel de cotización</p>
      </div>

      <template v-if="hayDatos">
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-icon">💰</div>
            <div class="kpi-body">
              <div class="kpi-label">Inversión Inicial</div>
              <div class="kpi-value red">{{ fmt(local.costoTotal) }}</div>
            </div>
          </div>
          <div class="kpi-card kpi-highlight">
            <div class="kpi-icon">⏱</div>
            <div class="kpi-body">
              <div class="kpi-label">Tiempo de Retorno</div>
              <div class="kpi-value blue">{{ payback }}</div>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">📈</div>
            <div class="kpi-body">
              <div class="kpi-label">Flujo Neto 10 años</div>
              <div class="kpi-value" :class="flujoCaja10 >= 0 ? 'blue' : 'red'">{{ fmt(flujoCaja10) }}</div>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">🎯</div>
            <div class="kpi-body">
              <div class="kpi-label">Rentabilidad anual</div>
              <div class="kpi-value" :class="rentabilidadAnual >= 0 ? 'green' : 'red'">{{ rentabilidadAnual }}%</div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-legend">
            <span class="legend-dot red-dot"></span><span class="legend-text">En deuda</span>
            <span class="legend-dot blue-dot"></span><span class="legend-text">Recuperado</span>
            <span class="legend-line"></span><span class="legend-text">Punto de equilibrio</span>
          </div>
          <div class="chart-wrap">
            <Bar :key="chartKey" :data="chartJsData" :options="chartOptions" :plugins="chartPlugins" />
          </div>
        </div>

        <div class="table-card">
          <div class="table-header-row">
            <div class="table-title">Detalle anual</div>
            <div class="table-badge">{{ filas.length + 1 }} periodos</div>
          </div>
          <div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Año</th>
                  <th class="align-right">Ahorro Acumulado</th>
                  <th class="align-right">Flujo de Caja Neto</th>
                  <th class="align-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr class="row-neg">
                  <td class="cell-year">
                    <span class="year-badge year-zero">Año 0</span>
                  </td>
                  <td class="align-right cell-money">{{ fmt(0) }}</td>
                  <td class="align-right cell-money negative">{{ fmt(-local.costoTotal) }}</td>
                  <td class="align-center">
                    <span class="status-pill pill-neg">Inversión</span>
                  </td>
                </tr>
                <tr v-for="fila in filas" :key="fila.año" :class="fila.flujoCajaNeto >= 0 ? 'row-pos' : 'row-neg'">
                  <td class="cell-year">
                    <span class="year-badge" :class="fila.flujoCajaNeto >= 0 ? 'year-pos' : 'year-neg'">Año {{ fila.año }}</span>
                  </td>
                  <td class="align-right cell-money muted">{{ fmt(fila.ahorroAcumulado) }}</td>
                  <td class="align-right cell-money" :class="fila.flujoCajaNeto >= 0 ? 'positive' : 'negative'">
                    {{ fmt(fila.flujoCajaNeto) }}
                  </td>
                  <td class="align-center">
                    <span class="status-pill" :class="fila.flujoCajaNeto >= 0 ? 'pill-pos' : 'pill-neg'">
                      {{ fila.flujoCajaNeto >= 0 ? '✓ Recuperado' : '↓ En deuda' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCotizacionStore } from '../store/cotizacion.js'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const store    = useCotizacionStore()
const chartKey = ref(0)

const local = ref({ costoTotal: 0, ahorroMes: 0 })

// ─── Constantes del panel solar (mismas que Panel3) ──────────────────────────
const POTENCIA_PANEL_KWP = 0.62
const MAX_PANELES = 1048

const preciosExcel = [
  11203192, 14930717, 18230682, 18658242, 23433642, 28636602, 31614010, 34539494,
  34591419, 36256296, 37973099, 39052720, 41088674, 43124629, 46751447, 50291384,
  50378266, 51808038, 53324693, 53657436, 56425097, 59192757, 60640688, 62088620,
  62256154, 66699313, 71142473, 72745787, 74349101, 75308062, 77205620, 79103179,
  79663693, 81234768, 82805843, 84358068, 85910293, 89623948, 92659373, 95694797,
  96414423, 97992585, 99570748, 101134778, 102698809, 103393846, 104947636, 106501425,
  107973292, 109445158, 110810423, 113034505, 115258586, 115969400, 117480283, 118991167,
  120493207, 121995247, 122742609, 124238135, 125733661, 127446527, 128939012, 130431496,
  132897851, 135364205, 136111784, 137582574, 139053363, 139825579, 141291191, 142756804,
  144216635, 145676466, 146472704, 147928116, 149383529, 159155377, 168927226, 169801159,
  171397274, 172993388, 173883992, 175456644, 177029295, 178596356, 180163417, 181069548,
  182631396, 184193244, 185662736, 189705418, 193748100, 195316692, 196885284, 197792829,
  199356686, 200920543, 202400203, 203879862, 204959710, 206514691, 207988019, 208069673,
  209529130, 211070242, 212607402, 214144561, 215403110, 216950693, 218498276, 225206436,
  226760650, 228314863, 229865472, 231416081, 231540422, 233080510, 234620597, 234976028,
  235280425, 235584822, 236503821, 238031614, 239022900, 240547804, 242072708, 243594828,
  245116947, 245354854, 246868439, 248382025, 249382755, 250893746, 252404736, 253913248,
  255421759, 256429410, 257935503, 259441597, 261632013, 262788483, 263944953, 265443201,
  266941449, 267951970, 269447997, 270944024, 272364900, 273785776, 274948274, 276440105,
  277931935, 278954017, 283986674, 289019331, 290552643, 292085956, 293158720, 294690124,
  296221529, 297888113, 299418370, 300948627, 302477131, 304005635, 305086062, 306014657,
  306943252, 308021271, 309539208, 311057146, 312573482, 314089818, 315172144, 316686849,
  318201554, 319714745, 321227935, 322314357, 323267732, 324221108, 325305449, 326809446,
  328313443, 329816046, 331318649, 332406709, 333907874, 335409039, 336500814, 338000573,
  339500332, 340475429, 341450526, 342540320, 344032085, 345523849, 346941352, 348358854,
  349597964, 359587770, 369577576, 370623108, 372127344, 373631581, 374641841, 375652101,
  376696931, 378193669, 379690408, 380739155, 382234546, 383729936, 385224037, 386718137,
  387770599, 389263411, 390756222, 391812317, 392836534, 393860752, 395346885, 396833019,
  397888333, 399373254, 400858175, 402341945, 403825715, 404884328, 406366935, 407849542,
  408911409, 409950252, 410989096, 412465716, 413942336, 415003494, 416479017, 417954540,
  419018735, 422486680, 425954625, 427431243, 428907861, 429964991, 431020145, 432075299,
  433473409, 434871518, 436074251, 437544371, 439014491, 440074040, 441543149, 443012257,
  444480413, 445948569, 447010840, 448077725, 449144610, 465840631, 467315429, 468790226,
  470263985, 471737744, 472766339, 474239073, 475711807, 476743461, 478215185, 479686909,
  480775620, 481864331, 482896144, 484363124, 485830103, 487296136, 488762170, 489796837,
  491261928, 492727020, 493764482, 495228645, 496692809, 497790716, 498888622, 499926222,
  501386046, 502845869, 503886110, 505345049, 506803988, 508262077, 509720167, 510762933,
  512220166, 513677399, 514710688, 515743977, 516932938, 518386186, 519839433, 520884748,
  522337177, 523789606, 525241254, 526692902, 527740531, 529191386, 530642240, 539061309,
  540534999, 542008689, 543481636, 544954584, 546030324, 547502511, 548974698, 550052627,
  551524064, 552995501, 554466230, 555936959, 556050726, 557517753, 558984781, 560451121,
  561917462, 562996505, 564462137, 565927770, 567008841, 568473774, 569938708, 571402986,
  572867264, 573019800, 574480645, 575941491, 577023653, 578483826, 579944000, 581403547,
  582863095, 583947072, 585405966, 586864860, 588250106, 589635353, 589969960, 591425053,
  592880145, 593965136, 595419600, 596874063, 598327944, 599781825, 600868499, 602321767,
  603775035, 604863429, 605882953, 606902477, 608352201, 609801925, 610889542, 612338676,
  613787810, 614877072, 616325623, 617774173, 619222188, 620670203, 621760993, 622789737,
  623818482, 625263185, 626707887, 627797949, 629242096, 630686243, 631777845, 633221443,
  634665040, 636108137, 637551234, 638644261, 639681627, 640718992, 641811419, 643251370,
  644691322, 646130792, 647570262, 648664050, 650103002, 651541953, 652907397, 654272841,
  655514037, 656559480, 657604924, 679081171, 680526506, 681971842, 683416648, 684861454,
  685926745, 687371007, 688815268, 689882176, 691325898, 692769620, 693832195, 694894770,
  695961387, 697402242, 698843097, 699911269, 701351602, 702791935, 704231777, 705671619,
  706741266, 708180597, 709619929, 710689338, 711758747, 712828118, 714264748, 715701378,
  716772216, 718208351, 719644486, 721080158, 722515830, 723588056, 725023244, 726458432,
  727532072, 728607082, 729682092, 739621646, 749561200, 750611224, 752050792, 753490359,
  754856399, 756222438, 757420073, 758858654, 760297234, 761350325, 762438728, 763527132,
  764963212, 766399293, 767452327, 768887925, 770323523, 771378036, 772813156, 774248276,
  775682938, 777117600, 778173535, 784408506, 790643478, 791721313, 793175515, 794629716,
  796083475, 797537233, 798616439, 800069742, 801523046, 802975915, 804428785, 805509336,
  806491480, 807473623, 808553579, 810003608, 811453638, 812903248, 814352857, 815434110,
  816883286, 818332462, 819415025, 820863771, 822312517, 823302659, 824292802, 825374766,
  826820831, 828266897, 829639525, 831012154, 832241424, 833686676, 835131929, 836216370,
  837661212, 839106054, 840103791, 841101528, 842185398, 843627691, 845069985, 846155063,
  847596957, 849038850, 850480369, 851921887, 853008113, 854449239, 855890365, 856107832,
  857546895, 858985959, 860424658, 861863358, 862950191, 864388508, 865826824, 867264784,
  868702744, 869790668, 871228252, 872665836, 872905660, 874341278, 875776895, 877212166,
  878647438, 879735940, 881170845, 882605749, 883695337, 885129878, 886564419, 887998623,
  889432827, 889693967, 891126295, 892558622, 893917581, 895276540, 896512710, 897944355,
  899376000, 900467131, 901898427, 903329724, 904760699, 906191674, 906473161, 907902343,
  909331525, 910423186, 911852027, 913280869, 914413465, 915546061, 916639304, 918067295,
  919495286, 920589503, 921620862, 922652220, 924078191, 925504162, 926597903, 928023548,
  929449192, 930874539, 932299886, 933394522, 934819548, 936244573, 937340143, 938377164,
  939414185, 940837277, 942260368, 943355481, 944778259, 946201036, 947297058, 948719524,
  950141990, 951564174, 952986357, 954083222, 955125661, 956168101, 957515393, 958862685,
  960105187, 961525215, 962945243, 964042540, 984392161, 1004741782, 1006173337, 1007604891,
  1008664918, 1009724599, 1010784280, 1011844177, 1013273836, 1014703494, 1016132827, 1017562159,
  1018623109, 1020052107, 1021481106, 1022543114, 1023971782, 1025400449, 1026464848, 1027529247,
  1028591112, 1030017969, 1031444825, 1032871368, 1034297911, 1035360786, 1036787008, 1038213229,
  1039277122, 1040703024, 1042128926, 1043197852, 1044266778, 1045330532, 1046754695, 1048178857,
  1049243604, 1050667454, 1052091304, 1053514855, 1054938407, 1056004109, 1057427353, 1058850597,
  1060200509, 1061550421, 1062062711, 1063484282, 1064905852, 1065972376, 1067393646, 1068814915,
  1070235897, 1071656880, 1072724322, 1074145007, 1075565692, 1076634066, 1077710986, 1078787905,
  1080206981, 1081626056, 1082694289, 1084113073, 1085531858, 1086601000, 1088019495, 1089437990,
  1090856211, 1092274433, 1093344446, 1094425402, 1095506358, 1096923030, 1098339701, 1099409577,
  1100825968, 1102242358, 1103313111, 1104729221, 1106145332, 1107561179, 1108977026, 1110048616,
  1111133457, 1112218298, 1113289787, 1114704125, 1116118464, 1117532545, 1118946626, 1120018931,
  1121432742, 1122846552, 1124187071, 1125527590, 1126746778, 1127835359, 1128923941, 1129996955,
  1132370441, 1134743928, 1136156308, 1137568689, 1138640828, 1140052945, 1141465062, 1142538018,
  1143949873, 1145361728, 1146454436, 1147547144, 1148619987, 1150030448, 1151440909, 1152514550,
  1153924753, 1155334957, 1156744921, 1158154885, 1159229285, 1160638996, 1162048706, 1163144881,
  1164241056, 1165315345, 1166723709, 1168132073, 1169207135, 1170615250, 1172023365, 1173431249,
  1174839132, 1175914926, 1177322563, 1178730201, 1192907863, 1194332937, 1195758010, 1197182858,
  1198607705, 1199702648, 1201127254, 1202551860, 1203903204, 1205254548, 1206496273, 1207920417,
  1209344561, 1209599860, 1211022651, 1212445443, 1213868015, 1215290588, 1216386542, 1217808880,
  1219231219, 1220327889, 1221749994, 1223172099, 1224593991, 1226015882, 1226286162, 1227706745,
  1229127327, 1230224293, 1231644647, 1233065001, 1234485145, 1235905289, 1237002913, 1238422831,
  1239842749, 1241262459, 1242682170, 1242966941, 1244385385, 1245803829, 1246901741, 1248319963,
  1249738185, 1251156203, 1252574222, 1253672770, 1255090570, 1256508369, 1293085624, 1294111719,
  1295137813, 1296562856, 1297987899, 1299059418, 1300484220, 1301909022, 1303260555, 1304612087,
  1305830448, 1307254780, 1308679113, 1309752171, 1310782427, 1311812683, 1313235575, 1314658467,
  1315731297, 1317153955, 1318576613, 1319650201, 1321072626, 1322495051, 1323917254, 1325339456,
  1326413778, 1327448064, 1328482351, 1329556470, 1330977267, 1332398063, 1333818641, 1335239220,
  1336314057, 1337734409, 1339154761, 1340574897, 1341995033, 1343070581, 1344108772, 1345146963,
  1346222315, 1347641087, 1349059860, 1350478420, 1351896981, 1352973029, 1354391369, 1355809710,
  1356886466, 1358304587, 1359722709, 1360764685, 1361806661, 1362883208, 1364300016, 1365716823,
  1367060388, 1368403952, 1369627250, 1371043638, 1372460026, 1373537935, 1374954110, 1376370286,
  1377415933, 1378461579, 1379539286, 1380954186, 1382369085, 1383447467, 1384862157, 1386276847,
  1387691339, 1389105831, 1390184860, 1391599145, 1393013430, 1394093121, 1395141899, 1396190678,
  1397603724, 1399016770, 1400096258, 1401509100, 1402921942, 1404334592, 1405747242, 1406827358,
  1408239805, 1409652253, 1410733013, 1411785261, 1412837508, 1414248753, 1415659997, 1416740559,
  1418151605, 1419562651, 1420643845, 1422054693, 1423465541, 1424876203, 1426286866, 1429143131,
  1430199130, 1431255130, 1432591967, 1433928805, 1435155279, 1436564960, 1437974641, 1439055660,
  1440465146, 1441874633, 1443283939, 1444693244, 1445774855, 1446834121, 1447893387, 1448974839,
  1450382993, 1451791148, 1453199124, 1454607100, 1455689133, 1457096920, 1458504707, 1459587339,
  1460994938, 1462402536, 1463464977, 1464527417, 1465609872, 1467016363, 1468422853, 1469829170,
  1471235487, 1472318506, 1473724639, 1475130772, 1476214375, 1477620324, 1479026272, 1480091799,
  1481157325, 1482240755, 1483645626, 1485050496, 1486134500, 1487539190, 1488943879, 1490348401,
  1491752923, 1492837470, 1494241813, 1495646156, 1496641645, 1497637135, 1498867590, 1500270883,
  1501674176, 1502759114, 1504162230, 1505565346, 1506968299, 1508371253, 1509456719, 1510859497,
  1512262276, 1512686641, 1514088557, 1515490473, 1516892229, 1518293985, 1519379832, 1520781416,
  1522182999, 1523269387, 1524670798, 1526072210, 1527473464, 1528874718, 1529308670, 1530709084,
  1532109498, 1533509756, 1534910014, 1535996747, 1537396836, 1538796925, 1539884185, 1559035387,
  1578186588, 1579593335, 1581000082, 1581421359, 1582827272, 1584233184, 1585298878, 1586704608,
  1588110339, 1589515896, 1590921453, 1591987731, 1593393108, 1594798485, 1596130652, 1597462819,
  1598039549, 1599443941, 1600848332, 1601915142, 1603319356, 1604723570, 1606127615, 1607531660,
  1608599039, 1610002908, 1611406777, 1612474735, 1613564355, 1614653974, 1616056882, 1617459789,
  1618527688, 1619930422, 1621333157, 1622401625, 1623804187, 1625206749, 1626609147, 1628011544,
  1629080563, 1630172641, 1631264718, 1632666179, 1634067639, 1635136599, 1636537889, 1637939180,
  1639008697, 1640409818, 1641810940, 1643211902, 1644612864, 1645682916, 1646777391, 1647871866,
  1648941878, 1650341917, 1651741955, 1653141837, 1654541718, 1655612257, 1657011973, 1658411689
]

// ─── Recalcula costoTotal desde los parámetros de la URL ─────────────────────
const _fromB64 = (b64) => decodeURIComponent(escape(atob(b64)))

const calcularDesdeURL = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const isNew = urlParams.has('d')
    const isOld = urlParams.has('data')
    if (!isNew && !isOld) return false

    const data = isNew
      ? JSON.parse(_fromB64(urlParams.get('d')))
      : JSON.parse(decodeURIComponent(urlParams.get('data')))

    // ── Usar costoTotal y ahorroMes que Panel3 ya calculó correctamente ──────
    // Si vienen en el payload (enlace nuevo), usarlos directamente sin recalcular
    if (data.costoTotal > 0 && data.ahorroMes > 0) {
      sincronizar(data.costoTotal, data.ahorroMes)
      return true
    }

    // ── Fallback para enlaces viejos que no traen costoTotal/ahorroMes ────────
    const generacion   = data.generacion   || 0
    const hbsVal       = data.hbs          || 3.8
    const tarifaKwh    = data.tarifaKwh    || 0
    const contribucion = data.contribucion || 0
    const aluPublico   = data.aluPublico   || 0
    const autoconsumo  = data.autoconsumo  || 0
    const adicionales  = data.adicionales  || 0
    const descuento    = data.descuento    || 0

    if (!generacion) return false

    let mejorN = 1, menorDif = Infinity
    for (let n = 1; n <= MAX_PANELES; n++) {
      const gen = Math.round(POTENCIA_PANEL_KWP * n * 30 * hbsVal * 100) / 100
      const dif = Math.abs(gen - generacion)
      if (dif < menorDif) { menorDif = dif; mejorN = n }
    }

    const valorBase                = preciosExcel[mejorN - 1] || 0
    const valorTotalConAdicionales = valorBase + adicionales
    const costoTotal               = Math.round(valorTotalConAdicionales * (1 - descuento / 100))

    const auto = autoconsumo / 100
    let ahorroMes = 0
    if (auto > 0 && generacion > 0 && tarifaKwh > 0) {
      const J14 = generacion * auto * tarifaKwh * (1 + contribucion / 100 + aluPublico / 100)
      const K14 = generacion * (1 - auto) * (tarifaKwh - 200)
      ahorroMes = Math.round(J14 + K14)
    }
    const consumo = data.consumo || 0
    if (ahorroMes <= 0 && consumo > 0 && tarifaKwh > 0) {
      ahorroMes = Math.round(consumo * tarifaKwh)
    }

    if (costoTotal > 0 && ahorroMes > 0) {
      sincronizar(costoTotal, ahorroMes)
      return true
    }
    return false
  } catch (e) {
    console.error('Panel8: error leyendo URL', e)
    return false
  }
}

const sincronizar = (costoTotal, ahorroMes) => {
  if (costoTotal > 0 && ahorroMes > 0) {
    local.value = { costoTotal, ahorroMes: Number(ahorroMes) }
    chartKey.value++
  } else {
    // Si no hay ahorro calculable, resetear para que hayDatos sea false
    // y la gráfica desaparezca
    local.value = { costoTotal: 0, ahorroMes: 0 }
    chartKey.value++
  }
}

// ← Solo muestra gráfica si hay ahorro REAL (autoconsumo > 0), no con el fallback de pagoMensual
const onEvento = e => {
  const { costoTotal, ahorroMes, valorConDescuento, pagoMensual, generacion, tarifaKwh } = e.detail
  const hayDatosBasicos = (generacion || 0) > 0 && (tarifaKwh || 0) > 0 && (costoTotal || 0) > 0
  if (!hayDatosBasicos) {
    sincronizar(0, 0)
    return
  }
  const ahorro = (ahorroMes || 0) > 0 ? ahorroMes : (pagoMensual || 0)
  sincronizar(valorConDescuento ?? costoTotal, ahorro)
}

const calcDesdeStore = () => {
  const costo  = store.costoTotal || 0
  const desc   = store.descuento  || 0
  // ← Aplicar descuento si el store lo tiene
  const costoFinal = desc > 0 ? Math.round(costo * (1 - desc / 100)) : costo
  const ahorro = store.ahorroMes  || 0

  if (costoFinal > 0 && ahorro > 0) { sincronizar(costoFinal, ahorro); return }

  const gen    = store.generacionPlanta || store.generacion || 0
  const tarifa = store.tarifaKwh || store.tarifaElectricidad || 0
  const contrib = store.contribucion || 0
  const alu    = store.aluPublico   || 0
  const auto   = (store.autoconsumo || 0) / 100
  const pago   = store.pagoMensual  || 0

  let ahorroCalc = 0
  if (auto > 0 && gen > 0 && tarifa > 0) {
    const J14 = gen * auto * tarifa * (1 + contrib / 100 + alu / 100)
    const K14 = gen * (1 - auto) * (tarifa - 200)
    ahorroCalc = Math.round(J14 + K14)
  }
  if (ahorroCalc <= 0 && pago > 0) ahorroCalc = pago
  if (costoFinal > 0 && ahorroCalc > 0) sincronizar(costoFinal, ahorroCalc)
}

onMounted(() => {
  window.addEventListener('cotizacion-actualizada', onEvento)
  const cargadoDesdeURL = calcularDesdeURL()
  if (!cargadoDesdeURL) calcDesdeStore()
})
onUnmounted(() => window.removeEventListener('cotizacion-actualizada', onEvento))

const hayDatos    = computed(() => local.value.costoTotal > 0 && local.value.ahorroMes > 0)
const ahorroAnual = computed(() => local.value.ahorroMes * 12)

const filas = computed(() =>
  Array.from({ length: 10 }, (_, i) => {
    const año = i + 1
    const ahorroAcumulado = año * ahorroAnual.value
    const flujoCajaNeto   = ahorroAcumulado - local.value.costoTotal
    return { año, ahorroAcumulado, flujoCajaNeto }
  })
)

const flujoCaja10 = computed(() => filas.value[9]?.flujoCajaNeto ?? 0)

const payback = computed(() => {
  const anual = ahorroAnual.value
  if (anual <= 0) return 'N/A'
  const años = local.value.costoTotal / anual
  if (años > 10) return '> 10 años'
  return `${años.toFixed(1)} años`
})

const rentabilidadAnual = computed(() =>
  local.value.costoTotal > 0
    ? Math.round((ahorroAnual.value / local.value.costoTotal) * 100)
    : 0
)

const chartJsData = computed(() => {
  const labels = ['Año 0', ...filas.value.map(p => `Año ${p.año}`)]
  const data   = [-local.value.costoTotal, ...filas.value.map(p => p.flujoCajaNeto)]
  return {
    labels,
    datasets: [{
      label: 'Flujo Neto',
      data,
      backgroundColor: data.map(v => v < 0 ? 'rgba(239,68,68,0.80)' : 'rgba(37,99,235,0.80)'),
      borderColor:     data.map(v => v < 0 ? '#b91c1c' : '#1d4ed8'),
      borderWidth: 2,
      borderRadius: { topLeft: 8, topRight: 8, bottomLeft: 8, bottomRight: 8 },
      borderSkipped: false,
      barPercentage: 0.65,
      categoryPercentage: 0.8,
    }]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(10,15,30,0.95)',
      titleColor: '#f8fafc',
      bodyColor: '#94a3b8',
      padding: 14,
      cornerRadius: 12,
      displayColors: false,
      callbacks: {
        title: ctx => ctx[0].label,
        label: ctx => {
          const idx = ctx.dataIndex
          if (idx === 0) return [`  Inversión: ${fmt(local.value.costoTotal)}`, `  Flujo: ${fmt(ctx.raw)}`]
          const f = filas.value[idx - 1]
          return [
            `  Ahorro acumulado:  ${fmt(f.ahorroAcumulado)}`,
            `  Flujo neto:        ${fmt(f.flujoCajaNeto)}`,
          ]
        }
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        color: '#64748b',
        font: { size: 11, weight: '600', family: 'DM Sans, sans-serif' },
        maxRotation: 45,
        minRotation: 0,
      }
    },
    y: {
      grid: { color: 'rgba(203,213,225,0.5)', drawBorder: false },
      border: { display: false },
      ticks: {
        color: '#64748b',
        font: { size: 10, family: 'DM Sans, sans-serif' },
        callback: v => {
          const abs = Math.abs(v) / 1_000_000
          return v < 0 ? `-$${abs.toFixed(0)}M` : `$${abs.toFixed(0)}M`
        }
      }
    }
  },
  animation: { duration: 900, easing: 'easeOutQuart' }
}))

const chartPlugins = [{
  id: 'breakeven',
  afterDraw: chart => {
    const { ctx, chartArea, scales } = chart
    if (!scales.y || !chartArea) return
    const y0 = scales.y.getPixelForValue(0)
    if (y0 < chartArea.top || y0 > chartArea.bottom) return
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(chartArea.left, y0)
    ctx.lineTo(chartArea.right, y0)
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.stroke()
    ctx.restore()
  }
}]

const fmt = v => new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP',
  minimumFractionDigits: 0, maximumFractionDigits: 0
}).format(v)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

.panel8 {
  --red:   #ef4444;
  --red-bg: rgba(239,68,68,0.08);
  --blue:  #2563eb;
  --blue-bg: rgba(37,99,235,0.08);
  --green: #059669;
  --green-bg: rgba(5,150,105,0.08);
  --amber: #f59e0b;
  --surface: #ffffff;
  --surface-2: #f8fafc;
  --border: #e2e8f0;
  --text-primary: #0f172a;
  --text-muted: #64748b;
  --radius-lg: 20px;
  --radius-md: 14px;
  --radius-sm: 8px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04);

  position: relative;
  background: linear-gradient(145deg, #f0f7ff 0%, #fafffe 50%, #f0fdf4 100%);
  border-radius: 28px;
  padding: clamp(20px, 4vw, 48px);
  overflow: hidden;
  font-family: 'DM Sans', sans-serif;
  width: 100%;
  box-sizing: border-box;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.35;
  pointer-events: none;
}
.blob-1 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, #bfdbfe, transparent);
  top: -80px; right: -60px;
}
.blob-2 {
  width: 250px; height: 250px;
  background: radial-gradient(circle, #bbf7d0, transparent);
  bottom: -60px; left: -40px;
}

.inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 3vw, 28px);
}

.header { text-align: center; }
.header-badge {
  display: inline-block;
  background: linear-gradient(135deg, #dbeafe, #d1fae5);
  color: #1d4ed8;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 12px;
  border: 1px solid rgba(37,99,235,0.15);
}
.panel-title {
  font-size: clamp(20px, 3.5vw, 30px);
  font-weight: 700;
  margin: 0 0 8px;
  background: linear-gradient(135deg, #1e3a8a, #0891b2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}
.panel-subtitle {
  margin: 0;
  font-size: clamp(12px, 1.5vw, 14px);
  color: var(--text-muted);
  font-weight: 400;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: clamp(32px, 5vw, 64px) 24px;
  border: 2px dashed var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
}
.no-data-icon { font-size: clamp(40px, 6vw, 56px); opacity: 0.35; }
.no-data-text { color: var(--text-muted); font-size: 14px; font-weight: 500; text-align: center; margin: 0; }

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(10px, 2vw, 16px);
}
.kpi-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: clamp(12px, 2vw, 20px);
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.kpi-highlight {
  background: linear-gradient(135deg, #eff6ff, #f0fdf4);
  border-color: rgba(37,99,235,0.25);
}
.kpi-icon {
  font-size: clamp(20px, 3vw, 28px);
  flex-shrink: 0;
  line-height: 1;
}
.kpi-body { min-width: 0; }
.kpi-label {
  font-size: clamp(9px, 1.1vw, 11px);
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.kpi-value {
  font-size: clamp(11px, 1.5vw, 15px);
  font-weight: 700;
  font-family: 'DM Mono', monospace;
  color: var(--text-primary);
  word-break: break-all;
  line-height: 1.2;
}
.kpi-value.red   { color: var(--red); }
.kpi-value.blue  { color: var(--blue); }
.kpi-value.green { color: var(--green); }

.chart-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: clamp(16px, 3vw, 28px);
  box-shadow: var(--shadow-sm);
}
.chart-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
}
.legend-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.red-dot  { background: var(--red); }
.blue-dot { background: var(--blue); }
.legend-line {
  width: 20px; height: 2px;
  background: repeating-linear-gradient(90deg, var(--amber) 0, var(--amber) 5px, transparent 5px, transparent 10px);
  flex-shrink: 0;
}
.legend-text { margin-right: 8px; }
.chart-wrap {
  height: clamp(200px, 35vw, 320px);
  width: 100%;
}

.table-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}
.table-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(12px, 2vw, 18px) clamp(16px, 3vw, 24px);
  border-bottom: 1px solid var(--border);
  background: var(--surface-2);
}
.table-title {
  font-size: clamp(13px, 1.6vw, 15px);
  font-weight: 700;
  color: var(--text-primary);
}
.table-badge {
  background: var(--blue-bg);
  color: var(--blue);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid rgba(37,99,235,0.15);
}
.table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
table {
  width: 100%;
  border-collapse: collapse;
  min-width: 420px;
}
thead tr {
  background: linear-gradient(135deg, #1e3a8a, #0369a1);
}
thead th {
  color: rgba(255,255,255,0.9);
  font-size: clamp(10px, 1.2vw, 12px);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  padding: clamp(10px, 1.5vw, 14px) clamp(12px, 2vw, 20px);
  white-space: nowrap;
}
.align-right  { text-align: right; }
.align-center { text-align: center; }

tbody tr {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.15s ease;
}
tbody tr:last-child { border-bottom: none; }
tbody tr.row-neg { background: #fff8f8; }
tbody tr.row-pos { background: #f8fffc; }
tbody tr.row-neg:hover { background: #fee2e2; }
tbody tr.row-pos:hover { background: #dcfce7; }

.cell-year {
  padding: clamp(8px, 1.2vw, 12px) clamp(12px, 2vw, 20px);
  white-space: nowrap;
}
.year-badge {
  display: inline-block;
  font-size: clamp(10px, 1.2vw, 12px);
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
}
.year-zero { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
.year-neg  { background: var(--red-bg); color: #991b1b; border: 1px solid rgba(239,68,68,0.2); }
.year-pos  { background: var(--blue-bg); color: #1e40af; border: 1px solid rgba(37,99,235,0.2); }

.cell-money {
  padding: clamp(8px, 1.2vw, 12px) clamp(12px, 2vw, 20px);
  font-size: clamp(10px, 1.3vw, 13px);
  font-weight: 600;
  font-family: 'DM Mono', monospace;
  white-space: nowrap;
}
.cell-money.muted    { color: var(--text-muted); }
.cell-money.positive { color: var(--blue); }
.cell-money.negative { color: var(--red); }

.status-pill {
  display: inline-block;
  font-size: clamp(9px, 1.1vw, 11px);
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  white-space: nowrap;
}
.pill-pos { background: var(--blue-bg); color: var(--blue); border: 1px solid rgba(37,99,235,0.2); }
.pill-neg { background: var(--red-bg);  color: var(--red);  border: 1px solid rgba(239,68,68,0.2); }

@media (max-width: 900px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .kpi-card { flex-direction: column; align-items: flex-start; gap: 6px; padding: 14px; }
  .kpi-icon { font-size: 22px; }
  .kpi-label { white-space: normal; }
  .chart-legend { gap: 6px; font-size: 11px; }
  .legend-text { margin-right: 4px; }
}
@media (max-width: 380px) {
  .kpi-grid { grid-template-columns: 1fr 1fr; }
  .panel8 { border-radius: 16px; }
}
</style>