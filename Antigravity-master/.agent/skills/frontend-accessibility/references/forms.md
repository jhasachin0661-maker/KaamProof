# Accessible Forms Guidelines

## Input Labeling
Every form control must have an associated explicit label.

```html
<label htmlFor="email">Email Address</label>
<input id="email" type="email" name="email" required />
```

## Helper Text & Validation Errors
Link descriptions using `aria-describedby`:

```html
<label htmlFor="password">Password</label>
<input 
  id="password" 
  type="password" 
  aria-describedby="pass-hint pass-error"
  aria-invalid="true"
/>
<span id="pass-hint">Must be at least 8 characters.</span>
<span id="pass-error" role="alert" class="error">Password is too short.</span>
```

## Radio Groups & Checkboxes
Wrap grouped inputs in `<fieldset>` with `<legend>`:

```html
<fieldset>
  <legend>Notification Preference</legend>
  <label><input type="radio" name="notify" value="email" /> Email</label>
  <label><input type="radio" name="notify" value="sms" /> SMS</label>
</fieldset>
```
