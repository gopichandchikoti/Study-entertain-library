package course;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.*;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
record Note(long id,String title,String body,String topic) {}
record NoteRequest(@NotBlank @Size(max=120) String title,@NotBlank @Size(max=20000) String body,@NotBlank @Size(max=60) String topic) {}
interface NotesPort { List<Note> list(); Note create(NoteRequest request); Optional<Note> find(long id); }
@Repository class MemoryNotes implements NotesPort {
    private final Map<Long,Note> notes=new LinkedHashMap<>();
    private long nextId=1;
    public synchronized List<Note> list() { return List.copyOf(notes.values()); }
    public synchronized Note create(NoteRequest r) {
        Note note=new Note(nextId++,r.title().trim(),r.body().trim(),r.topic().trim());notes.put(note.id(),note);return note;
    }
    public synchronized Optional<Note> find(long id) { return Optional.ofNullable(notes.get(id)); }
}
@Service class NotesService {
    private final NotesPort repository;
    NotesService(NotesPort repository) { this.repository=repository; }
    List<Note> list(int limit) {
        if(limit<1||limit>100)throw new IllegalArgumentException("Invalid page size");
        return repository.list().stream().limit(limit).toList();
    }
    Note create(NoteRequest request) { return repository.create(request); }
    Note get(long id) { return repository.find(id).orElseThrow(NoSuchElementException::new); }
}
@RestController @RequestMapping("/notes")
class NotesController {
    private final NotesService service;
    NotesController(NotesService service) { this.service=service; }
    @GetMapping List<Note> list(@RequestParam(defaultValue="20") int limit) { return service.list(limit); }
    @PostMapping ResponseEntity<Note> create(@Valid @RequestBody NoteRequest request) { return ResponseEntity.status(201).body(service.create(request)); }
    @GetMapping("/{id}") Note get(@PathVariable long id) { return service.get(id); }
}
@RestControllerAdvice class SafeErrors {
    @ExceptionHandler(NoSuchElementException.class)
    ProblemDetail missing() { return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND,"Note not found"); }
    @ExceptionHandler(IllegalArgumentException.class)
    ProblemDetail invalid() { return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST,"Check the request limits"); }
}
