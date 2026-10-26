# Runnable Study Notes API
Run node --test *.test.mjs, then node server.mjs with Node 22.5+.
This loopback-only example uses x-demo-user: student-a or student-b as a synthetic identity.
It is not production authentication. Restart persistence uses notes.sqlite in this example directory.
Use a protected identity provider, migrations, readiness checks, deadlines, and rate limits before deployment.
The fixed test suite uses an in-memory database and an ephemeral loopback HTTP port.

curl http://127.0.0.1:8000/notes -H "x-demo-user: student-a"
