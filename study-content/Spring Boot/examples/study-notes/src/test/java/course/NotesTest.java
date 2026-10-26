package course;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
class NotesTest {
    @Test void serviceUsesRepositoryAndBoundsLists() {
        NotesService service=new NotesService(new MemoryNotes());
        assertEquals("APIs",service.create(new NoteRequest(" APIs ","Body","java")).title());
        assertEquals(1,service.list(20).size());
        assertThrows(IllegalArgumentException.class,()->service.list(101));
        assertThrows(java.util.NoSuchElementException.class,()->service.get(99));
    }
}
