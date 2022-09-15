## Mensajes de commit


feat: Guardar feature. Ex: mantenimiento de usuarios, mantenimiento de Oportunidades a corto plazo. 
add: Modificar un feature. De ser necesario.
fix: bug fix, indicar feature.
chore: Limpieza de código, de pronto intentado, reorganizar el orden de las funciones
refactor: Cambio de lógica, lo pude hacer mejor. Sin ser esto un bug fix o un feature nuevo
style: Cambios en el código que no afecten la lógica de datos de negocios. Ejemplo: movió de lugar un botón, cualquier otro estilo visual.
bump:en el caso que exista una actualización de versión en alguna de las dependencias
revert: revertir un commit accidental.


## GI PRETI LOG

`<addr>`
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
