import { createRouter, createWebHistory } from "vue-router";
import Perfil from "../Perfil.vue";
import Reserva from "../Reserva.vue";
import Platos from "../Platos.vue";
import Pricipal from "../Pricipal.vue";
import Register from "../Register.vue";
import Singin from "../Singin.vue";
import Pqr from "../Pqr.vue";
import Configuracion from "../Configuracion.vue";
import ReservasVer from "../ReservasVer.vue";
import { compile } from "vue";
import VistaAD from "../VistaAD.vue";
import UserForm from "../UserForm.vue";
import ReservasView from "../ReservasView.vue";
import ClientesView from "../ClientesView.vue";
import FormRespuestaPqr from "../formRespuestaPqr.vue";
import TablaPqrs from "../tablaPqrs.vue";
import TablaPqrsRespondidos from "../TablaPqrsRespondidos.vue";
import UpdateContra from "../updateContra.vue";
import UpdateCorreo from "../updateCorreo.vue";
import Campings from "../Campings.vue";
import Eventos from "../Eventos.vue";
import Mesas from "../Mesas.vue";
import Recorrido from "../Recorrido.vue";
import TiposPlan from "../tiposPlan.vue";
import FormPlanes from "../FormPlanes.vue";
import PlanesVer from "../planesVer.vue";

import ResetPassword from "../ResetPassword.vue";
import CorreoRecuperacion from "../correoRecuperacion.vue";
import NeqP from "../NequiP.vue";
import Pasarela from "../Pasarela.vue";

const routes = [
    {
        path: "/index",
        name: "index",
        component: Pricipal
    },
    {
        /*path: "/Perfil",
        name: "Perfil",
        component: Perfil*/
    },
    {
        path: "/Reservas",
        name: "Reservas",
        component: Reserva
    },
    {
        path: "/Platos",
        name: "Platos",
        component: Platos
    },
    {
        path: '/',
        redirect: '/index',
        meta: { showHeader: true }, 
    },
    {
        path: '/Registrar',
        name: 'Register',
        component: Register,
    },
    {
        path: '/Iniciar',
        name: 'Iniciar',
        component: Singin,
    },
    {
        path: '/pqr',
        name: 'pqr',
        component : Pqr,
    },
    {
        path: '/conf',
        name: 'conf',
        component: Configuracion,
    },
    {
        path: '/ResVer',
        name: 'ResVer',
        component: ReservasVer,
    },
    {
        path: '/VistaAd',
        name: 'VisataAd',
        component:VistaAD,
    },
    {
        path: '/UserForm',
        name: 'UserForm',
        component:UserForm,
    },
    {
        path: '/ReservasView',
        name: 'ReservasView',
        component:ReservasView,
    },
    {
        path: '/ClientesVer',
        name: 'Clientes',
        component:ClientesView
    },
    {
        path: '/formResp',
        name: 'formResp',
        component:FormRespuestaPqr
    },
    {
        path: '/TablaPqrAd',
        name: 'TablapqrAd',
        component:TablaPqrs
    },
    {
        path: '/TablaPqrRes',
        name: 'TablaPqrsRes',
        component:TablaPqrsRespondidos
    },
    {
        path: '/updateContra',
        name: 'updateContra',
        component:UpdateContra
    },
    {
        path: '/updateCorreo',
        name: 'ipdateCorreo',
        component:UpdateCorreo
    },
    {
        path: '/camping',
        name: 'camping',
        component:Campings
    },
    {
        path: '/eventos',
        name: 'eventos',
        component:Eventos
    },
    {
        path: '/mesas',
        name: 'mesas',
        component:Mesas
    },
    {
        path: '/recorrido',
        name: 'recorrido',
        component:Recorrido
    },
    {
        path: '/tpPlan',
        name: 'tpPlan',
        component:TiposPlan
    },
    {
        path: '/formPlan',
        name: 'formPlan',
        component: FormPlanes
    },
    {
        path: '/planVer',
        name: 'planVer',
        component: PlanesVer
    },
    {
        path: '/ResetPassword',
        name: 'ResetPassword',
        component: ResetPassword
    },
    {
        path: '/RecuperarPasword',
        name: 'RecuperarPasword',
        component: CorreoRecuperacion
    },
    {
        path: "/Pasarelas",
        name: "Pasarela",
        component: Pasarela
    },
    {
        path: "/NequiP",
        name: "nequiP",
        component: NeqP
    }
    
];
const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;