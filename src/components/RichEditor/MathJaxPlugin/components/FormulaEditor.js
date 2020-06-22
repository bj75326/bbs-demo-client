import React, {Component} from 'react';
import {Popover, Button, Row, Col, Switch} from 'antd';
import styles from '../index.less';
import {formulaButtons} from '../../editorIcon';
import formulaSymbols from './symbol';
import MathJaxNode from './MathJaxNode';
import {prefix} from '../../../../common/setup';
import {insertAtCaret} from '../../../../utils/utils';

const popoverContent = {
	'greek': [
	  <button type="button" className={styles.palettesButton} key="\alpha" data-content="\alpha">
	    <svg className={styles.palettesIcon} width="1.488ex" height="1.676ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#alpha_1318469421"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\beta" data-content="\beta">
	    <svg className={styles.palettesIcon} width="1.332ex" height="2.509ex" style={{verticalAlign: "-0.671ex"}}>
	      <title></title>
	      <use xlinkHref="#beta_170234155"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\gamma" data-content="\gamma">
	    <svg className={styles.palettesIcon} width="1.262ex" height="2.176ex" style={{verticalAlign: "-0.838ex"}}>
	      <title></title>
	      <use xlinkHref="#gamma_1311936542"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\delta" data-content="\delta">
	    <svg className={styles.palettesIcon} width="1.049ex" height="2.343ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#delta_1323077121"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\epsilon" data-content="\epsilon">
	    <svg className={styles.palettesIcon} width="0.944ex" height="1.676ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#epsilon_3526400827"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\varepsilon" data-content="\varepsilon">
	    <svg className={styles.palettesIcon} width="1.083ex" height="1.676ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#varepsilon_960150590"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\zeta" data-content="\zeta">
	    <svg className={styles.palettesIcon} width="1.095ex" height="2.509ex" style={{verticalAlign: "-0.671ex"}}>
	      <title></title>
	      <use xlinkHref="#zeta_170233907"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\eta" data-content="\eta">
	    <svg className={styles.palettesIcon} width="1.169ex" height="2.176ex" style={{verticalAlign: "-0.838ex"}}>
	      <title></title>
	      <use xlinkHref="#eta_2087567017"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\theta" data-content="\theta">
	    <svg className={styles.palettesIcon} width="1.09ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#theta_1322769205"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\vartheta" data-content="\vartheta">
	    <svg className={styles.palettesIcon} width="1.374ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#vartheta_3952813808"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\iota" data-content="\iota">
	    <svg className={styles.palettesIcon} width="0.823ex" height="1.676ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#iota_170249034"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\kappa" data-content="\kappa">
	    <svg className={styles.palettesIcon} width="1.339ex" height="1.676ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#kappa_1326819122"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\lambda" data-content="\lambda">
	    <svg className={styles.palettesIcon} width="1.355ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#lambda_79015454"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\mu" data-content="\mu">
	    <svg className={styles.palettesIcon} width="1.402ex" height="2.176ex" style={{verticalAlign: "-0.838ex"}}>
	      <title></title>
	      <use xlinkHref="#mu_193423105"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\nu" data-content="\nu">
	    <svg className={styles.palettesIcon} width="1.232ex" height="1.676ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#nu_193423138"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\xi" data-content="\xi">
	    <svg className={styles.palettesIcon} width="1.03ex" height="2.509ex" style={{verticalAlign: "-0.671ex"}}>
	      <title></title>
	      <use xlinkHref="#xi_193418728"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\pi" data-content="\pi">
	    <svg className={styles.palettesIcon} width="1.332ex" height="1.676ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#pi_193418976"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\varpi" data-content="\varpi">
	    <svg className={styles.palettesIcon} width="1.924ex" height="1.676ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#varpi_1640113541"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\rho" data-content="\rho">
	    <svg className={styles.palettesIcon} width="1.202ex" height="2.176ex" style={{verticalAlign: "-0.838ex"}}>
	      <title></title>
	      <use xlinkHref="#rho_2087900556"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\varrho" data-content="\varrho">
	    <svg className={styles.palettesIcon} width="1.202ex" height="2.009ex" style={{verticalAlign: "-0.671ex"}}>
	      <title></title>
	      <use xlinkHref="#varrho_4099271785"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\sigma" data-content="\sigma">
	    <svg className={styles.palettesIcon} width="1.33ex" height="1.676ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#sigma_1312148424"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\varsigma" data-content="\varsigma">
	    <svg className={styles.palettesIcon} width="0.942ex" height="1.843ex" style={{verticalAlign: "-0.505ex"}}>
	      <title></title>
	      <use xlinkHref="#varsigma_233085869"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\tau" data-content="\tau">
	    <svg className={styles.palettesIcon} width="1.202ex" height="1.676ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#tau_2087983641"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\upsilon" data-content="\upsilon">
	    <svg className={styles.palettesIcon} width="1.255ex" height="1.676ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#upsilon_3526401323"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\phi" data-content="\phi">
	    <svg className={styles.palettesIcon} width="1.385ex" height="2.509ex" style={{verticalAlign: "-0.671ex"}}>
	      <title></title>
	      <use xlinkHref="#phi_2087833096"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\varphi" data-content="\varphi">
	    <svg className={styles.palettesIcon} width="1.52ex" height="2.176ex" style={{verticalAlign: "-0.838ex"}}>
	      <title></title>
	      <use xlinkHref="#varphi_1675249005"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\chi" data-content="\chi">
	    <svg className={styles.palettesIcon} width="1.455ex" height="2.009ex" style={{verticalAlign: "-0.671ex"}}>
	      <title></title>
	      <use xlinkHref="#chi_2087832827"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\psi" data-content="\psi">
	    <svg className={styles.palettesIcon} width="1.513ex" height="2.509ex" style={{verticalAlign: "-0.671ex"}}>
	      <title></title>
	      <use xlinkHref="#psi_2087863571"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\omega" data-content="\omega">
	    <svg className={styles.palettesIcon} width="1.446ex" height="1.676ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#omega_1309716888"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\Gamma" data-content="\Gamma">
	    <svg className={styles.palettesIcon} width="1.453ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#gamma_1311937598"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\Delta" data-content="\Delta">
	    <svg className={styles.palettesIcon} width="1.936ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#delta_1323076193"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\Theta" data-content="\Theta">
	    <svg className={styles.palettesIcon} width="1.808ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#theta_1322770389"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\Lambda" data-content="\Lambda">
	    <svg className={styles.palettesIcon} width="1.613ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#lambda_79016510"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\Xi" data-content="\Xi">
	    <svg className={styles.palettesIcon} width="1.55ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#xi_193417672"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\Pi" data-content="\Pi">
	    <svg className={styles.palettesIcon} width="1.743ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#pi_193417920"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\Sigma" data-content="\Sigma">
	    <svg className={styles.palettesIcon} width="1.678ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#sigma_1312149480"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\Upsilon" data-content="\Upsilon">
	    <svg className={styles.palettesIcon} width="1.808ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#upsilon_3526402507"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\Phi" data-content="\Phi">
	    <svg className={styles.palettesIcon} width="1.678ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#phi_2087834152"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\Psi" data-content="\Psi">
	    <svg className={styles.palettesIcon} width="1.808ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#psi_2087862643"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\Omega" data-content="\Omega">
	    <svg className={styles.palettesIcon} width="1.678ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#omega_1309717944"></use>
	    </svg>
	  </button>
	],
	'symbol': [
	  <button type="button" className={styles.palettesButton} key="\times" data-content="\times">
	    <svg className={styles.palettesIcon} width="1.808ex" height="1.509ex" style={{verticalAlign: "0.019ex", marginBottom: "-0.19ex"}}>
	      <title></title>
	      <use xlinkHref="#times_2159110463"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\div" data-content="\div">
	    <svg className={styles.palettesIcon} width="1.808ex" height="1.843ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#div_2088172514"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\cdot" data-content="\cdot">
	    <svg className={styles.palettesIcon} width="0.647ex" height="1.176ex" style={{verticalAlign: "0.439ex", marginBottom: "-0.61ex"}}>
	      <title></title>
	      <use xlinkHref="#cdot_183307621"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\pm" data-content="\pm">
	    <svg className={styles.palettesIcon} width="1.808ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#pm_193414628"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\mp" data-content="\mp">
	    <svg className={styles.palettesIcon} width="1.808ex" height="2.009ex" style={{verticalAlign: "-0.671ex"}}>
	      <title></title>
	      <use xlinkHref="#mp_193426244"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\ast" data-content="\ast">
	    <svg className={styles.palettesIcon} width="1.162ex" height="1.509ex" style={{verticalAlign: "0.079ex", marginBottom: "-0.25ex"}}>
	      <title></title>
	      <use xlinkHref="#ast_2087933023"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\star" data-content="\star">
	    <svg className={styles.palettesIcon} width="1.162ex" height="1.509ex" style={{verticalAlign: "0.035ex", marginBottom: "-0.206ex"}}>
	      <title></title>
	      <use xlinkHref="#star_194646573"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\circ" data-content="\circ">
	    <svg className={styles.palettesIcon} width="1.162ex" height="1.509ex" style={{verticalAlign: "0.125ex", marginBottom: "-0.297ex"}}>
	      <title></title>
	      <use xlinkHref="#circ_177147074"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\bullet" data-content="\bullet">
	    <svg className={styles.palettesIcon} width="1.162ex" height="1.509ex" style={{verticalAlign: "0.125ex", marginBottom: "-0.297ex"}}>
	      <title></title>
	      <use xlinkHref="#bullet_1823366303"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\oplus" data-content="\oplus">
	    <svg className={styles.palettesIcon} width="1.808ex" height="2.176ex" style={{verticalAlign: "-0.505ex"}}>
	      <title></title>
	      <use xlinkHref="#oplus_2140408172"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\ominus" data-content="\ominus">
	    <svg className={styles.palettesIcon} width="1.808ex" height="2.176ex" style={{verticalAlign: "-0.505ex"}}>
	      <title></title>
	      <use xlinkHref="#ominus_1906208922"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\oslash" data-content="\oslash">
	    <svg className={styles.palettesIcon} width="1.808ex" height="2.176ex" style={{verticalAlign: "-0.505ex"}}>
	      <title></title>
	      <use xlinkHref="#oslash_1351473011"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\otimes" data-content="\otimes">
	    <svg className={styles.palettesIcon} width="1.808ex" height="2.176ex" style={{verticalAlign: "-0.505ex"}}>
	      <title></title>
	      <use xlinkHref="#otimes_2531166928"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\odot" data-content="\odot">
	    <svg className={styles.palettesIcon} width="1.808ex" height="2.176ex" style={{verticalAlign: "-0.505ex"}}>
	      <title></title>
	      <use xlinkHref="#odot_183307497"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\dagger" data-content="\dagger">
	    <svg className={styles.palettesIcon} width="1.032ex" height="2.676ex" style={{verticalAlign: "-0.838ex"}}>
	      <title></title>
	      <use xlinkHref="#dagger_1389219435"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\ddagger" data-content="\ddagger">
	    <svg className={styles.palettesIcon} width="1.032ex" height="2.509ex" style={{verticalAlign: "-0.671ex"}}>
	      <title></title>
	      <use xlinkHref="#ddagger_2894567663"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\vee" data-content="\vee">
	    <svg className={styles.palettesIcon} width="1.55ex" height="2.009ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#vee_2087413967"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\wedge" data-content="\wedge">
	    <svg className={styles.palettesIcon} width="1.55ex" height="2.009ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#wedge_1162335725"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\cap" data-content="\cap">
	    <svg className={styles.palettesIcon} width="1.55ex" height="2.009ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#cap_2088096139"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\cup" data-content="\cup">
	    <svg className={styles.palettesIcon} width="1.55ex" height="2.009ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#cup_2088074399"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\aleph" data-content="\aleph">
	    <svg className={styles.palettesIcon} width="1.42ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#aleph_1603530409"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\Re" data-content="\Re">
	    <svg className={styles.palettesIcon} width="1.924ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#re_193404814"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\Im" data-content="\Im">
	    <svg className={styles.palettesIcon} width="1.288ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#im_193412861"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\top" data-content="\top">
	    <svg className={styles.palettesIcon} width="1.808ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#top_2088097970"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\bot" data-content="\bot">
	    <svg className={styles.palettesIcon} width="1.808ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#bot_2087963360"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\infty" data-content="\infty">
	    <svg className={styles.palettesIcon} width="2.324ex" height="1.676ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#infty_2224287093"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\partial" data-content="\partial">
	    <svg className={styles.palettesIcon} width="1.318ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#partial_1646186250"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\forall" data-content="\forall">
	    <svg className={styles.palettesIcon} width="1.293ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#forall_4023651683"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\exists" data-content="\exists">
	    <svg className={styles.palettesIcon} width="1.293ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#exists_1947215609"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\neg" data-content="\neg">
	    <svg className={styles.palettesIcon} width="1.55ex" height="1.176ex" style={{verticalAlign: "0.204ex", marginBottom: "-0.376ex"}}>
	      <title></title>
	      <use xlinkHref="#neg_2087624725"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\angle" data-content="\angle">
	    <svg className={styles.palettesIcon} width="1.678ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#angle_1166132696"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\triangle" data-content="\triangle">
	    <svg className={styles.palettesIcon} width="2.066ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#triangle_1315666263"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\diamond" data-content="\diamond">
	    <svg className={styles.palettesIcon} width="1.162ex" height="1.509ex" style={{verticalAlign: "0.026ex", marginBottom: "-0.197ex"}}>
	      <title></title>
	      <use xlinkHref="#diamond_2948158269"></use>
	    </svg>
	  </button>
	],
	'comparison': [
	  <button type="button" className={styles.palettesButton} key="\leq" data-content="\leq">
	    <svg className={styles.palettesIcon} width="1.808ex" height="2.176ex" style={{verticalAlign: "-0.505ex"}}>
	      <title></title>
	      <use xlinkHref="#leq_2088123777"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\geq" data-content="\geq">
	    <svg className={styles.palettesIcon} width="1.808ex" height="2.176ex" style={{verticalAlign: "-0.505ex"}}>
	      <title></title>
	      <use xlinkHref="#geq_2088123562"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\prec" data-content="\prec">
	    <svg className={styles.palettesIcon} width="1.808ex" height="1.843ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#prec_176608541"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\succ" data-content="\succ">
	    <svg className={styles.palettesIcon} width="1.808ex" height="1.843ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#succ_176814527"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\preceq" data-content="\preceq">
	    <svg className={styles.palettesIcon} width="1.808ex" height="2.176ex" style={{verticalAlign: "-0.505ex"}}>
	      <title></title>
	      <use xlinkHref="#preceq_3517413801"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\succeq" data-content="\succeq">
	    <svg className={styles.palettesIcon} width="1.808ex" height="2.176ex" style={{verticalAlign: "-0.505ex"}}>
	      <title></title>
	      <use xlinkHref="#succeq_3517341131"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\ll" data-content="\ll">
	    <svg className={styles.palettesIcon} width="2.324ex" height="1.843ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#ll_193412985"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\gg" data-content="\gg">
	    <svg className={styles.palettesIcon} width="2.324ex" height="1.843ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#gg_193411929"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\equiv" data-content="\equiv">
	    <svg className={styles.palettesIcon} width="1.808ex" height="1.509ex" style={{verticalAlign: "0.081ex", marginBottom: "-0.253ex"}}>
	      <title></title>
	      <use xlinkHref="#equiv_1981568039"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\sim" data-content="\sim">
	    <svg className={styles.palettesIcon} width="1.808ex" height="1.343ex" style={{verticalAlign: "0.307ex", marginBottom: "-0.478ex"}}>
	      <title></title>
	      <use xlinkHref="#sim_2087688366"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\simeq" data-content="\simeq">
	    <svg className={styles.palettesIcon} width="1.808ex" height="1.509ex" style={{verticalAlign: "0.081ex", marginBottom: "-0.253ex"}}>
	      <title></title>
	      <use xlinkHref="#simeq_1929181338"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\asymp" data-content="\asymp">
	    <svg className={styles.palettesIcon} width="1.808ex" height="1.509ex" style={{verticalAlign: "0.035ex", marginBottom: "-0.206ex"}}>
	      <title></title>
	      <use xlinkHref="#asymp_1903012079"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\approx" data-content="\approx">
	    <svg className={styles.palettesIcon} width="1.808ex" height="1.509ex" style={{verticalAlign: "0.125ex", marginBottom: "-0.297ex"}}>
	      <title></title>
	      <use xlinkHref="#approx_3715476797"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\ne" data-content="\ne">
	    <svg className={styles.palettesIcon} width="1.808ex" height="2.676ex" style={{verticalAlign: "-0.838ex"}}>
	      <title></title>
	      <use xlinkHref="#ne_193405746"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\subset" data-content="\subset">
	    <svg className={styles.palettesIcon} width="1.808ex" height="1.843ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#subset_1805468287"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\supset" data-content="\supset">
	    <svg className={styles.palettesIcon} width="1.808ex" height="1.843ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#supset_1806220461"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\subseteq" data-content="\subseteq">
	    <svg className={styles.palettesIcon} width="1.808ex" height="2.176ex" style={{verticalAlign: "-0.505ex"}}>
	      <title></title>
	      <use xlinkHref="#subseteq_2051895947"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\supseteq" data-content="\supseteq">
	    <svg className={styles.palettesIcon} width="1.808ex" height="2.176ex" style={{verticalAlign: "-0.505ex"}}>
	      <title></title>
	      <use xlinkHref="#supseteq_2051566041"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\in" data-content="\in">
	    <svg className={styles.palettesIcon} width="1.55ex" height="1.843ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#in_193419230"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\ni" data-content="\ni">
	    <svg className={styles.palettesIcon} width="1.55ex" height="1.843ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#ni_193418046"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\notin" data-content="\notin">
	    <svg className={styles.palettesIcon} width="1.55ex" height="2.676ex" style={{verticalAlign: "-0.838ex"}}>
	      <title></title>
	      <use xlinkHref="#notin_1650680875"></use>
	    </svg>
	  </button>
	],
	'math': [
	  <button type="button" className={styles.palettesButton} key="x_{a}" data-content="x_{a}">
	    <svg className={styles.palettesIcon} width="2.432ex" height="2.009ex" style={{verticalAlign: "-0.671ex"}}>
	      <title></title>
	      <use xlinkHref="#x_a_193458981"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="x^{b}" data-content="x^{b}">
	    <svg className={styles.palettesIcon} width="2.267ex" height="2.676ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#xb_193427367"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="x_{a}^{b}" data-content="x_{a}^{b}">
	    <svg className={styles.palettesIcon} width="2.432ex" height="2.843ex" style={{verticalAlign: "-0.671ex"}}>
	      <title></title>
	      <use xlinkHref="#x_ab_3953731551"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\bar{x}" data-content="\bar{x}">
	    <svg className={styles.palettesIcon} width="1.33ex" height="2.009ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#barx_3677001718"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\tilde{x}" data-content="\tilde{x}">
	    <svg className={styles.palettesIcon} width="1.33ex" height="2.176ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#tildex_2388847703"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\frac{a}{b}" data-content="\frac{a}{b}">
	    <svg className={styles.palettesIcon} width="2.066ex" height="4.843ex" style={{verticalAlign: "-2.005ex"}}>
	      <title></title>
	      <use xlinkHref="#fracab_2392580300"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\sqrt{x}" data-content="\sqrt{x}">
	    <svg className={styles.palettesIcon} width="3.266ex" height="3.009ex" style={{verticalAlign: "-1.005ex"}}>
	      <title></title>
	      <use xlinkHref="#sqrtx_1093998339"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\sqrt[n]{x}" data-content="\sqrt[n]{x}">
	    <svg className={styles.palettesIcon} width="3.266ex" height="3.009ex" style={{verticalAlign: "-1.005ex"}}>
	      <title></title>
	      <use xlinkHref="#sqrtnx_3625618123"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\bigcap_{a}^{b}" data-content="\bigcap_{a}^{b}">
	    <svg className={styles.palettesIcon} width="2.582ex" height="7.343ex" style={{verticalAlign: "-3.005ex"}}>
	      <title></title>
	      <use xlinkHref="#bigcap_ab_1527652773"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\bigcup_{a}^{b}" data-content="\bigcup_{a}^{b}">
	    <svg className={styles.palettesIcon} width="2.582ex" height="7.343ex" style={{verticalAlign: "-3.005ex"}}>
	      <title></title>
	      <use xlinkHref="#bigcup_ab_745232433"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\prod_{a}^{b}" data-content="\prod_{a}^{b}">
	    <svg className={styles.palettesIcon} width="2.969ex" height="7.343ex" style={{verticalAlign: "-3.005ex"}}>
	      <title></title>
	      <use xlinkHref="#prod_ab_1740866194"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\coprod_{a}^{b}" data-content="\coprod_{a}^{b}">
	    <svg className={styles.palettesIcon} width="2.969ex" height="7.343ex" style={{verticalAlign: "-3.005ex"}}>
	      <title></title>
	      <use xlinkHref="#coprod_ab_1722723006"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\left( x \right)" data-content="\left( x \right)">
	    <svg className={styles.palettesIcon} width="3.139ex" height="2.843ex" style={{verticalAlign: "-0.838ex"}}>
	      <title></title>
	      <use xlinkHref="#leftxright_308942087"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\left[ x \right]" data-content="\left[ x \right]">
	    <svg className={styles.palettesIcon} width="2.623ex" height="2.843ex" style={{verticalAlign: "-0.838ex"}}>
	      <title></title>
	      <use xlinkHref="#leftxright_1060968992"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\left\{ x \right\}" data-content="\left\{ x \right\}">
	    <svg className={styles.palettesIcon} width="3.655ex" height="2.843ex" style={{verticalAlign: "-0.838ex"}}>
	      <title></title>
	      <use xlinkHref="#leftxright_1282332352"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\left| x \right|" data-content="\left| x \right|">
	    <svg className={styles.palettesIcon} width="2.623ex" height="2.843ex" style={{verticalAlign: "-0.838ex"}}>
	      <title></title>
	      <use xlinkHref="#leftxright_791668582"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\int_{a}^{b}" data-content="\int_{a}^{b}">
	    <svg className={styles.palettesIcon} width="3.402ex" height="6.343ex" style={{verticalAlign: "-2.338ex"}}>
	      <title></title>
	      <use xlinkHref="#int_ab_3437240392"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\oint_{a}^{b}" data-content="\oint_{a}^{b}">
	    <svg className={styles.palettesIcon} width="3.402ex" height="6.343ex" style={{verticalAlign: "-2.338ex"}}>
	      <title></title>
	      <use xlinkHref="#oint_ab_1759784839"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\sum_{a}^{b}{x}" data-content="\sum_{a}^{b}{x}">
	    <svg className={styles.palettesIcon} width="5.072ex" height="7.343ex" style={{verticalAlign: "-3.005ex"}}>
	      <title></title>
	      <use xlinkHref="#sum_abx_3782346798"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\lim_{a \rightarrow b}{x}" data-content="\lim_{a \rightarrow b}{x}">
	    <svg className={styles.palettesIcon} width="4.946ex" height="3.843ex" style={{verticalAlign: "-2.005ex"}}>
	      <title></title>
	      <use xlinkHref="#lim_arightarrowbx_3542561616"></use>
	    </svg>
	  </button>
	],
	'arrow': [
	  <button type="button" className={styles.palettesButton} key="\leftarrow" data-content="\leftarrow">
	    <svg className={styles.palettesIcon} width="2.324ex" height="1.843ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#leftarrow_2463726907"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\rightarrow" data-content="\rightarrow">
	    <svg className={styles.palettesIcon} width="2.324ex" height="1.843ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#rightarrow_3982089376"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\leftrightarrow" data-content="\leftrightarrow">
	    <svg className={styles.palettesIcon} width="2.324ex" height="1.843ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#leftrightarrow_2294107771"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\Leftarrow" data-content="\Leftarrow">
	    <svg className={styles.palettesIcon} width="2.324ex" height="1.843ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#leftarrow_2463728091"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\Rightarrow" data-content="\Rightarrow">
	    <svg className={styles.palettesIcon} width="2.324ex" height="1.843ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#rightarrow_3982088320"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\Leftrightarrow" data-content="\Leftrightarrow">
	    <svg className={styles.palettesIcon} width="2.324ex" height="1.843ex" style={{verticalAlign: "-0.338ex"}}>
	      <title></title>
	      <use xlinkHref="#leftrightarrow_2294108699"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\uparrow" data-content="\uparrow">
	    <svg className={styles.palettesIcon} width="1.162ex" height="2.509ex" style={{verticalAlign: "-0.671ex"}}>
	      <title></title>
	      <use xlinkHref="#uparrow_3989605765"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\downarrow" data-content="\downarrow">
	    <svg className={styles.palettesIcon} width="1.162ex" height="2.509ex" style={{verticalAlign: "-0.671ex"}}>
	      <title></title>
	      <use xlinkHref="#downarrow_2479725650"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\updownarrow" data-content="\updownarrow">
	    <svg className={styles.palettesIcon} width="1.162ex" height="2.843ex" style={{verticalAlign: "-0.838ex"}}>
	      <title></title>
	      <use xlinkHref="#updownarrow_3181819383"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\Uparrow" data-content="\Uparrow">
	    <svg className={styles.palettesIcon} width="1.42ex" height="2.509ex" style={{verticalAlign: "-0.671ex"}}>
	      <title></title>
	      <use xlinkHref="#uparrow_3989604837"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\Downarrow" data-content="\Downarrow">
	    <svg className={styles.palettesIcon} width="1.42ex" height="2.509ex" style={{verticalAlign: "-0.671ex"}}>
	      <title></title>
	      <use xlinkHref="#downarrow_2479726706"></use>
	    </svg>
	  </button>,
	  <button type="button" className={styles.palettesButton} key="\Updownarrow" data-content="\Updownarrow">
	    <svg className={styles.palettesIcon} width="1.42ex" height="2.843ex" style={{verticalAlign: "-0.838ex"}}>
	      <title></title>
	      <use xlinkHref="#updownarrow_3181820311"></use>
	    </svg>
	  </button>
	]
};

class FormulaEditor extends Component {

	constructor(props){
		super(props);
		this.state = {
			inputValue: this.props.value,
		};
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.value !== this.state.value){
			this.setState({
				inputValue: nextProps.value,
			});		
		}
	} 

  handlePalettesClick = e => {
    let target = e.target;
    if(target.tagName.toUpperCase() === 'DIV') return;
    
    while(target.tagName.toUpperCase() !== 'BUTTON'){
      target = target.parentNode;   
    }
    if(target && target.dataset.content){
			const {newValue, newSelectionRange} = insertAtCaret(this.textareaEl, target.dataset.content);
			if(this.props.onChange){
				this.props.onChange(newValue);		
			}else{
				this.setState({
					inputValue: newValue,
				});
			}
			setTimeout(() => {
				this.textareaEl.focus();
				this.textareaEl.setSelectionRange(newSelectionRange, newSelectionRange);
			}, 0);
		}
  }

  handleInputChange = e => {
		if(this.props.onChange){
			this.props.onChange(e.target.value);
			return;		
		}
		this.setState({
			inputValue: e.target.value,	
		});      
	}

	handleConfirm = () => {
		this.props.onConfirm(this.state.inputValue);
	}

	handleCancel = () => {
		this.props.onCancel();
	}

	handleSwitchChange = () => {
		this.props.onSwitchChange();
	}

  render(){
		const {inputValue : value} = this.state;
		
		const {showBlockSwitch = false, showAsBlock} = this.props;
    const btnArr = ['greek', 'symbol', 'comparison', 'math', 'arrow'];
    return (
      <div className={styles.formulaEditor}>
        <label className={styles.formulaInput}>
          <div className={styles.mathToolbar}>
            {formulaButtons.map((buttonIcon, index) => (
              <Popover
                content={
                  <div className={`${styles.palettes} ${btnArr[index]}`} onClick={this.handlePalettesClick}>
                    {popoverContent[btnArr[index]]}  
                  </div>
                }
                trigger="click"
                overlayClassName={styles.palettesWrapper}
                key={btnArr[index]}
              >
                <button className={styles.toolbarBtn}>
                  {buttonIcon}
                </button>  
              </Popover>
            ))}
            {formulaSymbols}
          </div>
          <textarea
            type="text"
            value={value}
            onChange={this.handleInputChange}
            className={styles.textarea}
						placeholder="Enter TeX formula here..."
						ref={el=>{this.textareaEl = el}}
          />
        </label>
        <div className={styles.formulaPreview}>
          {value ? (
            <MathJaxNode>
              {value}  
            </MathJaxNode>
          ) : (
            <div className={styles.previewText}>Preview</div>  
          )}
        </div>
				{showBlockSwitch && (
					<div className={styles.blockSwitch}>
						<label>Insert as block:</label>
						<Switch
							checked={showAsBlock}		
							className={`${prefix}-switch`}
							onClick={this.handleSwitchChange}
						/>
					</div>
				)}
				<Row gutter={24} style={{marginBottom: '24px'}}>
					<Col span={12}>
						<Button className={`${prefix}-btn`} onClick={this.handleCancel}>Cancel</Button>		
					</Col>
					<Col span={12}>
						<Button
							className={`${prefix}-btn`}
							onClick={this.handleConfirm}
							disabled={!value}
							type="primary"
						>
							Confirmed		
						</Button>
					</Col>		
				</Row>
			</div>  
    );
  }
}

export default FormulaEditor;