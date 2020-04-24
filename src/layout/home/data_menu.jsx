import React from 'react';
import SvgStudent from 'icons/svg_student.svg';
import SvgCycle from 'icons/svg_cycle.svg';
import SvgEvent from 'icons/svg_event.svg';
import SvgList from 'icons/svg_list.svg';
import SvgGroup from 'icons/svg_group.svg';
import SvgVerifiedUser from 'icons/svg_verified_user.svg';
import SvgSupervisorUser from 'icons/svg_supervisor.svg';

let data = [];
data['students']   = { svg: SvgStudent, paths: ['/alumnos']};
data['cycle']      = { svg: SvgCycle, paths: ['/configurar-ciclo']};
data['asistance']  = { svg: SvgList, paths: ['/asistencias']};
// data['asistance/student']  = { svg: SvgList};
data['events']     = { svg: SvgEvent, paths: ['/eventos']};
data['groups']     = { svg: SvgGroup, paths: ['/grupos']};
data['types_user'] = { svg: SvgVerifiedUser, paths: ['/tipos-de-usuario']};
data['users']      = { svg: SvgSupervisorUser, paths: ['/usuarios']};
data['generic']    = { paths: ['/cambiar-contrasena','/olvido-contrasena']};

export default data;
