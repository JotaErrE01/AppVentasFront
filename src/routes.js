import React, { Suspense, Fragment, lazy } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import LoadingScreen from 'src/components/LoadingScreen';
import AuthGuard from 'src/components/AuthGuard';
import GuestGuard from 'src/components/GuestGuard';
import SimpleLayout from './layouts/SimpleLayout';


export const renderRoutes = (routes = []) => (
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Component = route.component;
        return (
          <Route key={i} path={route.path} exact={route.exact}
            render={(props) => (
              <Guard>
                <Layout>
                  {route.routes ? renderRoutes(route.routes) : <Component {...props} />}
                </Layout>
              </Guard>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

const routes = [

  {
    exact: true,
    path: '/test',
    component: lazy(() => import('src/views/afp_test'))
  },
  {
    exact: true,
    path: '/meet/:hash',
    component: lazy(() => import('src/views/extra/janus/VideoCallSharingTestView'))
  },
  {
    exact: true,
    path: '/coreSala/:idSala',
    component: lazy(() => import('src/views/afp_core_rooms/Room'))
  },


  {
    exact: true,
    path: '/call/:hash/:phone',
    component: lazy(() => import('src/views/extra/janus/SipTestView'))
  },
  {
    exact: true,
    path: '/call/:hash/',
    component: lazy(() => import('src/views/extra/janus/SipTestView'))
  },

  {
    exact: true,
    path: '/cliente/inicio/:tipo_fondo',
    component: lazy(() => import('src/views/afp_sharepoint_public'))
  },


  {
    exact: true,
    path: '/logs',
    component: lazy(() => import('src/views/LogsScreen'))
  },


  {
    exact: true,
    path: '/404',
    component: lazy(() => import('src/views/errors/NotFoundView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/login',
    component: lazy(() => import('src/views/afp_auth/LoginModule'))
  },

  {
    exact: true,
    guard: GuestGuard,
    path: '/login2',
    component: lazy(() => import('src/views/afp_auth/Login'))
  },



  {
    exact: true,
    path: '/login-unprotected',
    component: lazy(() => import('src/views/auth/LoginView'))
  },
  {
    exact: true,
    guard: GuestGuard,
    path: '/register',
    component: lazy(() => import('src/views/auth/RegisterView'))
  },
  {
    exact: true,
    path: '/register-unprotected',
    component: lazy(() => import('src/views/auth/RegisterView'))
  },

  // {
  //   exact: true,
  //   path: '/test',
  //   component: lazy(() => import('src/views/afp_test'))
  // },

  {
    path: '/afp',
    guard: AuthGuard,
    layout: SimpleLayout,
    routes: [

      /** seleccionar si se va a crear una oportunidad o se va a listar las oportunidades del usuario */
      {
        exact: true,
        path: '/afp/ventas',
        component: lazy(() => import('src/views/afp_index'))
      },

      // :: OPORTUNIDAD ::
      {
        exact: true,
        path: '/afp/crm/oportunidad',
        component: lazy(() => import('src/views/afp_oportunidad'))
      },


      // :: ROOMS
      {
        exact: true,
        path: '/afp/room/:id',
        component: lazy(() => import('src/views/afp_rooms_admin'))
      },


      






      /** si selecciona crear le pide el tipo de fondo que quiere crear */
      // {
      //   exact: true,
      //   path: '/afp/crm/oportunidad/seleccionarFondo',
      //   component: lazy(() => import('src/views/afp_oportunidad/OportunidadCreate'))
      // },

      /** seleccionar fondo e insertar cedula para crear la oportunidad segun el fondo seleccionado */
      {
        exact: true,
        path: '/afp/crm/oportunidad/opciones',
        component: lazy(() => import('src/views/afp_fondos/SeleccionFondoClienteView'))
      },

      {
        exact: true,
        path: '/afp/crm/oportunidad/opciones/loadIntencion/:intencionId',
        component: lazy(() => import('src/views/afp_fondos/SeleccionFondoClienteView'))
      },




 

      // {
      //   exact: true,
      //   path: '/afp/crm/oportunidad/crearOportunidad/largoPlazo',
      //   component: lazy(() => import('src/views/afp_fondos/buscar_cliente'))
      // },

      /**si es largo plazo 2 pasos */
      /**busqueda y consulta del cliente existe o no paso 1*/
      {
        exact: true,
        path: '/afp/crm/oportunidad/crear/fondolargoPlazo',
        component: lazy(() => import('src/views/afp_fondos/SeleccionFondoClienteView'))
      },
      /**si existe y le da a crear */
      {
        exact: true,
        path: '/afp/crm/oportunidad/crear/registroOportunidad/:idCliente/largoPlazo',
        component: lazy(() => import('src/views/afp_fondos/fondo_largo_plazo/mantenimiento_oportunidad/ContributionSystem'))
      },
      {
        exact: true,
        path: '/afp/crm/oportunidad/crear/registroOportunidad/:idCliente/largoPlazo/:idSistema',
        component: lazy(() => import('src/views/afp_fondos/fondo_largo_plazo/mantenimiento_oportunidad/RegisterOportunity'))
      },
      {
        exact: true,
        path: '/afp/crm/oportunidad/editar/registroOportunidad/:idOportunidad/:paso?',
        component: lazy(() => import('src/views/afp_fondos/fondo_largo_plazo/mantenimiento_oportunidad/RegisterOportunity'))
      },
      {
        exact: true,
        path: '/afp/crm/oportunidad/crear/registroOportunidad/:idCliente/cortoPlazo/:codigoFondo',
        component: lazy(() => import('src/views/afp_fondos/FondoCortoPlazo'))
      },
        /** si es corto plazo 2 pasos */
        /**busqueda y consulta del cliente existe o no paso 1*/        {
        exact: true,
        path: '/afp/crm/oportunidad/crear/fondocortoPlazo',
        component: lazy(() => import('src/views/afp_fondos/SeleccionFondoClienteView/index'))
      },
      {
        exact: true,
        path: '/afp/crm/oportunidad/editar/registroOportunidad/:idOportunidad/cortoPlazo/:codigoFondo/:paso?',
        component: lazy(() => import('src/views/afp_fondos/FondoCortoPlazo'))
      },
      {
        exact: true,
        path: '/afp/crm/oportunidad/editar/oportunidad/:idOportunidad/cortoPlazo/2',
        component: lazy(() => import('src/views/afp_fondos/FondoCortoPlazo/formularios/Form2'))
      },
      /**si existe y le da a crear */
      {
        exact: true,
        path: '/afp/crm/oportunidad/crear/registroOportunidad/cortoPlazo',
        component: lazy(() => import('src/views/afp_oportunidad/OportunidadCortoPlazo/FormularioOCP'))
      },

      /** vista del mantenimiento de fondos si y solo si existe la cedula */
      // {
      //   exact: true,
      //   path: '/afp/crm/oportunidad/mantenimientoOportunidad/cortoPlazo',
      //   component: lazy(() => import('src/views/afp_oportunidad/mantenimiento_oportunidad/MaintenanceOportunity/'))
      // },
      {
        exact: true,
        path: '/afp/crm/oportunidad/mantenimientoOportunidad/:idOportunidad',
        component: lazy(() => import('src/views/afp_oportunidad/mantenimiento_oportunidad/MaintenanceOportunity'))
      },


      //:: CREANDO FONDOS

      {
        exact: true,
        path: '/afp/crm/oportunidad/mantenimientoOportunidad/:idCliente/crear/:codigoFondo',
        component: lazy(() => import('src/views/afp_oportunidad/mantenimiento_oportunidad/MaintenanceOportunity'))
      },





      /*
      {
        exact: true,
        path: '/afp/crm/oportunidad/mantenimientoOportunidad/cortoPlazo/:idCliente/crear/:codigoFondo',
        component: lazy(() => import('src/views/afp_oportunidad/mantenimiento_oportunidad/MaintenanceOportunity'))
      },
      {
        exact: true,
        path: '/afp/crm/oportunidad/mantenimientoOportunidad/largoPlazo',
        component: lazy(() => import('src/views/afp_oportunidad/mantenimiento_oportunidad/MaintenanceOportunity'))
      },

      */
      /** tablas de oportunidades segun fondo */
      {
        exact: true,
        path: '/afp/crm/oportunidad/listadoOportunidades/:id',
        component: lazy(() => import('src/views/afp_oportunidad/OportunidadListar'))
      },

      {
        exact: true,
        path: '/afp/crm/oportunidad/editar/registroOportunidad',
        component: lazy(() => import('src/views/afp_fondos/fondo_largo_plazo/mantenimiento_oportunidad/RegisterOportunity'))
      },
      {
        exact: true,
        path: '/afp/crm/oportunidad/editar/registroOportunidad/cortoPlazo',
        component: lazy(() => import('src/views/afp_oportunidad/OportunidadCortoPlazo/FormularioOCP'))
      },
      /* creacion y edicion de clientes */
      {
        exact: true,
        path: '/afp/clientes/editar/:idCliente/:paso?',
        component: lazy(() => import('src/views/afp_cliente/ClienteCreateAndEditarView'))
      },
      {
        exact: true,
        path: '/afp/clientes/crear',
        component: lazy(() => import('src/views/afp_cliente/ClienteCreateAndEditarView'))
      },

      // ::: PROSPECTOS :::

      {
        exact: true,
        path: '/afp/prospecto',
        component: lazy(() => import('src/views/afp_prospecto'))
      },

      {
        exact: true,
        path: '/afp/prospecto/:id',
        component: lazy(() => import('src/views/afp_prospecto'))
      },



      // ::: INTENCIONES :::
      {
        exact: true,
        path: '/afp/intencion',
        component: lazy(() => import('src/views/afp_intencion'))
      },
     

    






      // ::: ACTIVIDAD :::

      {
        exact: true,
        path: '/afp/actividad',
        component: lazy(() => import('src/views/afp_actividad'))
      },

      {
        exact: true,
        path: '/afp/actividad/editar/:id',
        component: lazy(() => import('src/views/afp_actividad'))
      },

      {
        exact: true,
        path: '/afp/actividad/crear',
        component: lazy(() => import('src/views/afp_actividad'))
      },

      {
        exact: true,
        path: '/afp/actividad/eliminar/:id',
        component: lazy(() => import('src/views/afp_actividad'))
      },

      // :: ACTIVIDAD VARIANTE SPEED DIAL
      {
        exact: true,
        path: '/afp/actividad/crear/speeddial',
        component: lazy(() => import('src/views/afp_actividad'))
      },




      // ::: SHAREPOINT 
      {
        exact: true,
        path: '/afp/sharepoint',
        component: lazy(() => import('src/views/afp_sharepoint'))
      },
      {
        exact: true,
        path: '/afp/sharepoint/:id',
        component: lazy(() => import('src/views/afp_sharepoint/sharepointFile'))
      },
      // ::: NOTIFICACIONES 
      {
        exact: true,
        path: '/afp/notificaciones',
        component: lazy(()=>import('src/views/afp_notificacion'))
      },
      //REPORTES Y ANALITICA      
      {
        exact: true,
        path: '/afp/analytics',
        component: lazy(()=>import('src/views/afp_analytics'))
      },
      {
        exact: true,
        path: '/afp/analytics/oportunidades',
        component: lazy(()=>import('src/views/afp_analytics/Efectividad'))
      },      
      {
        exact: true,
        path: '/afp/analytics/prospectos',
        component: lazy(()=>import('src/views/afp_analytics/ProspectosOrigen'))
      },      
      {
        exact: true,
        path: '/afp/analytics/firma',
        component: lazy(()=>import('src/views/afp_analytics/Firma'))
      },
      {
        exact: true,
        path: '/afp/analytics/inteciones',
        component: lazy(() => import('src/views/afp_analytics/Intencion'))
      },
      {
        exact: true,
        path: '/afp/analytics/firma/sistemas',
        component: lazy(() => import('src/views/afp_analytics/FirmaSistemas'))
      },
      {
        exact: true,
        path: '/afp/analytics/registrocivil',
        component: lazy(() => import('src/views/afp_analytics/RegistroCivil'))
      },

      




      {
        exact: true,
        path: '/afp/prospectos/carga',
        component: lazy(()=>import('src/views/afp_carga_prospectos'))
      },
        {
          exact: true,
        path: '/afp/analytics/efectividad',
        component: lazy(() => import('src/views/afp_analytics/Efectividad'))
      }



    ]
  },

  {


    path: '/app',
    guard: AuthGuard,
    layout: DashboardLayout,
    routes: [
      /// JANUS_ROUTES
      {
        exact: true,
        path: '/app/extra/janus/echo',
        component: lazy(() => import('src/views/extra/janus/EchoTestView'))
      },
      {
        exact: true,
        path: '/app/extra/janus/screensharing',
        component: lazy(() => import('src/views/extra/janus/ScreenSharingTestView'))
      },
      {
        exact: true,
        path: '/app/extra/janus/videocall',
        component: lazy(() => import('src/views/extra/janus/VideoCallTestView'))
      },
      {
        exact: true,
        path: '/app/extra/janus/videoroom',
        component: lazy(() => import('src/views/extra/janus/VideoRoomTestView'))
      },
      {
        exact: true,
        path: '/app/extra/janus/audioroom',
        component: lazy(() => import('src/views/extra/janus/AudioRoomTestView'))
      },
      {
        exact: true,
        path: '/app/extra/janus/sip',
        component: lazy(() => import('src/views/extra/janus/SipTestView'))
      },
      {
        exact: true,
        path: '/app/extra/janus/videocallsharing/:hash',
        component: lazy(() => import('src/views/extra/janus/VideoCallSharingTestView'))
      },


      //END_JANUS_ROUTES

      {
        exact: true,
        path: '/app/account',
        component: lazy(() => import('src/views/account/AccountView'))
      },
      {
        exact: true,
        path: '/app/catalogomaestro',
        component: lazy(() => import('src/views/afp_catalogo/CatalogoMaestroView'))
      },
      {
        exact: true,
        path: '/app/catalogo',
        component: lazy(() => import('src/views/afp_catalogo/CatalogoView'))
      },


      {
        exact: true,
        path: '/app/fases',
        component: lazy(() => import('src/views/afp_catalogo/EmbudoVentasView'))
      },
      // {
      //   exact: true,
      //   path: '/afp/ventas/actividad',
      //   component: lazy(() => import('src/views/afp_actividad/conferenciaCreate'))
      // }, 
      {
        exact: true,
        path: '/app/motivos-acciones',
        component: lazy(() => import('src/views/afp_catalogo/MotivosAccionesView'))
      },



      {
        component: () => <Redirect to="/404" />
      },




    ]
  },




  {
    path: '*',
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: '/',
        guard: GuestGuard,
        component: lazy(() => import('src/views/afp_auth/Login'))
      },

      {
        component: () => <Redirect to="/404" />
      }
    ]
  }


];

export default routes;