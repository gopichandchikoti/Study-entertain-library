import java.util.*;
public class StudyNotes {
  record Note(long id, String title, String topic) {}
  interface Repository { Optional<Note> find(long id); void save(Note note); void delete(long id); }
  static final class MemoryRepository implements Repository {
    private final Map<Long,Note> values = new HashMap<>();
    public Optional<Note> find(long id) { return Optional.ofNullable(values.get(id)); }
    public void save(Note note) { values.put(note.id(),note); }
    public void delete(long id) { values.remove(id); }
  }
  static final class Service {
    private final Repository repository;
    Service(Repository repository) { this.repository=repository; }
    Note create(long id,String title,String topic) {
      if(id<=0||title==null||title.isBlank()||title.length()>120||topic==null||topic.isBlank()) throw new IllegalArgumentException("Invalid note");
      if(repository.find(id).isPresent()) throw new IllegalStateException("Duplicate note");
      Note note=new Note(id,title.trim(),topic.trim());repository.save(note);return note;
    }
    Note get(long id) { return repository.find(id).orElseThrow(()->new NoSuchElementException("Note not found")); }
    void delete(long id) { get(id);repository.delete(id); }
  }
  static void expect(Class<? extends Exception> type,Runnable action) {
    try { action.run();throw new AssertionError("Expected failure"); }
    catch(Exception e) { if(!type.isInstance(e))throw new AssertionError("Wrong failure",e); }
  }
  public static void main(String[] args) {
    Service service=new Service(new MemoryRepository());
    if(!service.create(1,"  APIs  ","java").title().equals("APIs"))throw new AssertionError("Normalization");
    expect(IllegalArgumentException.class,()->service.create(2," ","java"));
    expect(IllegalStateException.class,()->service.create(1,"duplicate","java"));
    expect(NoSuchElementException.class,()->service.get(99));
    service.delete(1);expect(NoSuchElementException.class,()->service.get(1));
    System.out.println("Study Notes service checks passed.");
  }
}
